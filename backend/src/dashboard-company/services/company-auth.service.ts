import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../../prisma/prisma.service';
import { CompanyLoginDto } from '../dto/login';

@Injectable()
export class CompanyAuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(dto: CompanyLoginDto) {
        const company = await this.prisma.company.findFirst({
            where: {
                adminEmail: dto.email,
            },
        });

        if (!company) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(
            dto.password,
            company.password,
        );

        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        await this.prisma.company.update({
            where: { id: company.id },
            data: { dpopPublicKey: dto.publicKey },
        });

        const token = await this.jwtService.signAsync({
            sub: company.id,
            role: 'COMPANY',
            cnf: {
                jwk: dto.publicKey,
            },
        });

        return {
            access_token: token,
        };
    }
}