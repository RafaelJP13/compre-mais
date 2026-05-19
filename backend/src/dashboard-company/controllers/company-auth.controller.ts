import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';

import { CompanyAuthService }
    from '../services/company-auth.service';

@Controller('company-auth')
export class CompanyAuthController {
    constructor(
        private readonly authService:
            CompanyAuthService,
    ) { }

    @Post('login')
    login(@Body() dto: any) {
        return this.authService.login(dto);
    }
}