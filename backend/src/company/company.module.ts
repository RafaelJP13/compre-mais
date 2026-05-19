import { Module }
    from '@nestjs/common';

import { JwtModule }
    from '@nestjs/jwt';

import { CompanyService }
    from './company.service';

import { CompanyController }
    from './company.controller';

import { PrismaModule }
    from '../../prisma/prisma.module';

@Module({

    imports: [

        PrismaModule,

        JwtModule.register({

            secret:
                process.env.JWT_SECRET,

            signOptions: {
                expiresIn: '15m',
            },
        }),
    ],

    controllers: [
        CompanyController,
    ],

    providers: [
        CompanyService,
    ],

    exports: [
        CompanyService,
    ],
})
export class CompanyModule { }