import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import * as crypto from 'crypto';
import { ReplayCache } from './replay-cache';

interface DpopHeader {
    typ: string;
    alg: string;
    jwk: JsonWebKey;
}

interface DpopPayload {
    jti: string;
    htm: string;  // HTTP method
    htu: string;  // HTTP URI
    iat: number;
    ath?: string; // hash do access token (obrigatório quando há token)
}

@Injectable()
export class VerifyProof {
    // tolerância de clock: 60 segundos
    private readonly CLOCK_SKEW = 60;
    // proof não pode ter mais de 120 segundos
    private readonly MAX_AGE = 120;

    constructor(private readonly replayCache: ReplayCache) { }

    async verify(
        dpopHeader: string,
        method: string,
        url: string,
        accessToken?: string,
    ): Promise<DpopPayload> {
        const parts = dpopHeader.split('.');

        if (parts.length !== 3) {
            throw new UnauthorizedException('Malformed DPoP proof');
        }

        const [headerB64, payloadB64, signatureB64] = parts;

        // --- decodificar header e payload ---
        let header: DpopHeader;
        let payload: DpopPayload;

        try {
            header = JSON.parse(
                Buffer.from(headerB64, 'base64url').toString('utf8'),
            );
            payload = JSON.parse(
                Buffer.from(payloadB64, 'base64url').toString('utf8'),
            );
        } catch {
            throw new UnauthorizedException('Invalid DPoP proof encoding');
        }

        // --- validar typ ---
        if (header.typ !== 'dpop+jwt') {
            throw new UnauthorizedException('DPoP proof typ must be dpop+jwt');
        }

        // --- validar alg ---
        const supportedAlgs = ['ES256', 'ES384', 'RS256'];
        if (!supportedAlgs.includes(header.alg)) {
            throw new UnauthorizedException(`Unsupported DPoP alg: ${header.alg}`);
        }

        // --- validar campos obrigatórios do payload ---
        if (!payload.jti || !payload.htm || !payload.htu || !payload.iat) {
            throw new UnauthorizedException('DPoP proof missing required claims');
        }

        // --- validar método HTTP ---
        if (payload.htm.toUpperCase() !== method.toUpperCase()) {
            throw new UnauthorizedException('DPoP htm mismatch');
        }

        // --- validar URI (ignorar query string) ---
        const proofUrl = new URL(payload.htu);
        const requestUrl = new URL(url);

        if (
            proofUrl.origin !== requestUrl.origin ||
            proofUrl.pathname !== requestUrl.pathname
        ) {
            throw new UnauthorizedException('DPoP htu mismatch');
        }

        // --- validar iat (freshness) ---
        const now = Math.floor(Date.now() / 1000);

        if (payload.iat > now + this.CLOCK_SKEW) {
            throw new UnauthorizedException('DPoP proof issued in the future');
        }

        if (payload.iat < now - this.MAX_AGE) {
            throw new UnauthorizedException('DPoP proof expired');
        }

        // --- validar ath quando há access token ---
        if (accessToken) {
            if (!payload.ath) {
                throw new UnauthorizedException('DPoP ath claim required');
            }

            const expectedAth = crypto
                .createHash('sha256')
                .update(accessToken)
                .digest('base64url');

            if (payload.ath !== expectedAth) {
                throw new UnauthorizedException('DPoP ath mismatch');
            }
        }

        // --- replay check ---
        if (this.replayCache.has(payload.jti)) {
            throw new UnauthorizedException('DPoP proof already used (replay)');
        }

        // --- verificar assinatura ---
        await this.verifySignature(
            header,
            `${headerB64}.${payloadB64}`,
            signatureB64,
        );

        return payload;
    }

    private async verifySignature(
        header: DpopHeader,
        signingInput: string,
        signatureB64: string,
    ): Promise<void> {
        const algMap: Record<string, { name: string; hash: string; namedCurve?: string }> = {
            ES256: { name: 'ECDSA', hash: 'SHA-256', namedCurve: 'P-256' },
            ES384: { name: 'ECDSA', hash: 'SHA-384', namedCurve: 'P-384' },
            RS256: { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        };

        const algParams = algMap[header.alg];

        if (!algParams) {
            throw new UnauthorizedException('Unsupported algorithm');
        }

        try {
            const keyParams: any = { name: algParams.name };
            if (algParams.namedCurve) {
                keyParams.namedCurve = algParams.namedCurve;
            }

            const cryptoKey = await crypto.subtle.importKey(
                'jwk',
                header.jwk as any,
                keyParams,
                false,
                ['verify'],
            );

            const signature = Buffer.from(signatureB64, 'base64url');
            const data = Buffer.from(signingInput, 'utf8');

            const valid = await crypto.subtle.verify(
                { name: algParams.name, hash: algParams.hash },
                cryptoKey,
                signature,
                data,
            );

            if (!valid) {
                throw new UnauthorizedException('DPoP signature invalid');
            }
        } catch (err) {
            if (err instanceof UnauthorizedException) throw err;
            throw new UnauthorizedException('DPoP signature verification failed');
        }
    }
}