import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/enum/roles.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }



  @Get()
  getUser(@Req() req) {
    const userId = req.user.id;
    return this.userService.findOne(userId);
  }
  @Get("all")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

}
