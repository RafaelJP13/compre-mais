import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { CompanyAuthController } from '../controllers/company-auth.controller';
import { CompanyAuthService } from '../services/company-auth.service';
import { CompanyStrategy } from '../strategies/company.strategy';
import { CompanyGuard } from '../guards/company.guard';
import { DpopGuard } from '../guards/dpop.guard';
import { VerifyProof } from '../dpop/verify-proof';
import { ReplayCache } from '../dpop/replay-cache';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '7d',
            },
        }),
    ],

    controllers: [
        CompanyAuthController,
    ],

    providers: [
        CompanyAuthService,
        CompanyStrategy,
        CompanyGuard,
        DpopGuard,
        VerifyProof,
        ReplayCache,
    ],

    exports: [
        CompanyGuard,
        DpopGuard,
    ],
})
export class DashboardCompanyModule { }