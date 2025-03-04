import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class UserService {
  constructor(private readonly dbservice: DbService) { }

  async findOne(userId: string) {
    return this.dbservice.user.findUnique({
      where: { id: userId },
    });
  }
  async findAll() {
    const users = this.dbservice.user.findMany();
    return users;
  }
}
