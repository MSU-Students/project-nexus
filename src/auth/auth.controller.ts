import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Anonymous, AuditEvent } from 'src/decorators';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Anonymous()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @AuditEvent({ action: 'LOGIN', module: 'AUTH', table: 'users' })
    login(@Body() signInDto: LoginDto) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @ApiBearerAuth()
    @Post('logout')
    @AuditEvent({ action: 'LOGOUT', module: 'AUTH', table: 'users' })
    logout() {
        return { message: 'Logged out successfully' };
    }

    @ApiBearerAuth()
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
