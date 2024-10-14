import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { DUser } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() data: DUser) {
    return await this.usersService.createUser(data);
  }
}
