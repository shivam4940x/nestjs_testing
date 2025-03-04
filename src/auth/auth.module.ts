import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { DbModule } from '@db/db.module';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.SECRET_KEY,
        signOptions: { expiresIn: '1h' },
      }),
    }),
    DbModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule { }
