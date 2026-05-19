import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class CompanyStrategy extends PassportStrategy(Strategy, 'company-jwt') {
    constructor() {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        });
    }

    async validate(payload: any) {
        if (payload.role !== 'COMPANY') {
            throw new UnauthorizedException('Not a company token');
        }

        return {
            id: payload.sub,
            role: payload.role,
            cnf: payload.cnf, // chave pública vinculada ao token
        };
    }
}