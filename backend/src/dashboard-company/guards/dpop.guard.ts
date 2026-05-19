import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';

import { VerifyProof } from '../dpop/verify-proof';

@Injectable()
export class DpopGuard implements CanActivate {
    constructor(private readonly verifyProof: VerifyProof) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        const dpopHeader = req.headers['dpop'] as string;

        if (!dpopHeader) {
            throw new UnauthorizedException('Missing DPoP proof');
        }

        // req.rawToken é populado pelo CompanyGuard (rode antes)
        const accessToken: string | undefined = req.rawToken;

        // monta a URL completa para validar o htu
        const protocol = req.protocol;
        const host = req.get('host');
        const fullUrl = `${protocol}://${host}${req.originalUrl}`;

        await this.verifyProof.verify(
            dpopHeader,
            req.method,
            fullUrl,
            accessToken,
        );

        return true;
    }
}