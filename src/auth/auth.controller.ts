import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@/common/guards/auth.guard';
import { ValidationPipe } from '@/common/pipes/validation.pipe';
import { AuthService } from './auth.service';
import { loginSchema, signupSchema } from './auth.schemas';
import { SignupRequest, LoginRequest } from './auth.models';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body(new ValidationPipe(signupSchema)) signupRequest: SignupRequest) {
    return this.authService.signup(signupRequest);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body(new ValidationPipe(loginSchema)) loginRequest: LoginRequest) {
    return this.authService.login(loginRequest);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getUserInfo(@Request() req) {
    const currentUser = req.user;
    return this.authService.getUserInfo(currentUser.email);
  }
}
