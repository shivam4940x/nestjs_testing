import { DbService } from '@db/db.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
  HttpException
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { passwordCompare, passwordHasher } from '@utility/helpers';
@Injectable()
export class AppService {
  constructor(private readonly dbservice: DbService) { }

  getHello(): string {
    return 'Hello!';
  }

  async signup(createUserDto: Prisma.UserCreateInput) {
    try {
      // Validate required fields manually (if DTO validation isn't used)
      const requiredFields = ['username', 'email', 'password'];
      const missingFields = requiredFields.filter(field => !createUserDto[field]);

      if (missingFields.length > 0) {
        throw new BadRequestException(`Missing required fields: ${missingFields.join(', ')}`);
      }


      // Check if user already exists
      const existingUser = await this.dbservice.user.findFirst({
        where: {
          OR: [
            { email: createUserDto.email },
            { username: createUserDto.username }
          ],
        },
      });

      if (existingUser) {
        throw new ConflictException('User already exists');
      }
      const { hashedPassword } = await passwordHasher(createUserDto.password);
      createUserDto.password = hashedPassword;
      const user = await this.dbservice.user.create({
        data: createUserDto,
      });

      return { message: 'User created successfully', user };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      console.error(error)
      throw new InternalServerErrorException('Failed to create user');
    }
  }



}
