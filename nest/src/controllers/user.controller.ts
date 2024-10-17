import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { AddUser } from 'src/application/use-cases/addUser';
import { GetAllUsers } from 'src/application/use-cases/getAllUsers';
import { SupprUser } from 'src/application/use-cases/SupprUser'
import { User } from 'src/domain/entities/user';

@Controller()

export class UserController {
  constructor(
    private useCase: GetAllUsers,
    private userAdd: AddUser,
    private userSuppr: SupprUser
  ) {}

  @Get('/users')
  async getAllUsers(): Promise<User[]> {
    return await this.useCase.execute();
  }

  @Post('/suppruser')
  async SupprUser(@Body() user: { userId: string}): Promise<User[]> {
    return await this.userSuppr.execute(user.userId);
  }


  @Post('/users')
  async addUser(@Body() userData: { firstName: string; lastName: string }): Promise<User> {
    const result = await this.userAdd.execute(userData);
    return result;
  }
}
