import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("/login")
  login(@Body() userDto: { username: string; password: string }) {
    return this.authService.login(userDto);
  }
  
  @Post('refresh-token')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  async logout(@Body('userId') userId: string) {
    return this.authService.logout(userId);
  }

}
