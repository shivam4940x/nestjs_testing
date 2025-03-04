import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Prisma } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/signup")
  signup(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.appService.signup(createUserDto);
  }
}
