import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { CompanyModule } from './company/company.module';
import { DashboardCompanyModule } from './dashboard-company/module/dashboard-company.module';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CompanyModule,
    DashboardCompanyModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }