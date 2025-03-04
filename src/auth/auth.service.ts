import { DbService } from '@db/db.service';
import { BadRequestException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { passwordCompare } from '@utility/helpers';
import { JwtPayload } from 'src/types/payload';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, readonly dbservice: DbService) { }

  async login(userDto: { username: string; password: string }) {
    try {
      if (!userDto.username || !userDto.password) {
        throw new BadRequestException('Username and password are required');
      }

      const user = await this.dbservice.user.findUnique({
        where: { username: userDto.username },
      });

      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }

      const isPasswordValid = await passwordCompare(userDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const jwtPayload = {
        id: user.id,
        username: userDto.username,
        role: user.role
      }

      const accessToken = this.jwtService.sign(jwtPayload, { expiresIn: '1h' });
      const refreshToken = this.jwtService.sign({ id: user.id }, { expiresIn: '7d' });
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      
      await this.dbservice.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken },
      });
      return {
        message: 'Login successful', user,
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw error instanceof HttpException ? error : new InternalServerErrorException('Login failed');
    }

  }

  async refreshToken(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is required');
      }

      const payload: JwtPayload = this.jwtService.verify(refreshToken);

      const user = await this.dbservice.user.findUnique({ where: { id: payload.id } });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        payload,
        { expiresIn: '1h' }
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }
  
  async logout(userId: string) {
    await this.dbservice.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

}
