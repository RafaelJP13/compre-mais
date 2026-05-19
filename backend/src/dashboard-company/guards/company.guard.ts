import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CompanyGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();

        const authHeader = req.headers['authorization'] as string;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing Bearer token');
        }

        const token = authHeader.slice(7);

        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });

            if (payload.role !== 'COMPANY') {
                throw new UnauthorizedException('Not a company token');
            }

            req.company = payload;
            req.rawToken = token; // necessário para o DpopGuard validar o ath

            return true;
        } catch (err) {
            if (err instanceof UnauthorizedException) throw err;
            throw new UnauthorizedException('Invalid token');
        }
    }
}