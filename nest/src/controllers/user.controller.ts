import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { AddUser } from 'src/application/use-cases/addUser';
import { GetFullNamesOfAllUsers } from 'src/application/use-cases/getFullNameOfAllUsers';
import { SupprUser } from 'src/application/use-cases/SupprUser'
import { User } from 'src/domain/entities/user';

@Controller()

export class UserController {
  constructor(
    private useCase: GetFullNamesOfAllUsers,
    private userAdd: AddUser,
    private userSuppr: SupprUser
  ) {}

  @Get('/users')
  async getFullNamesOfAllUsers(): Promise<User[]> {
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
