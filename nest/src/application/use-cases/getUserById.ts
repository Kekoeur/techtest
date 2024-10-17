import { Injectable, Inject } from "@nestjs/common";

import { UserService, UserServiceKey } from "../ports/user.port";
import { User } from "src/domain/entities/user";

@Injectable()

export class getUserById {
  constructor(
    @Inject(UserServiceKey)
    private userService: UserService
  ) {}

  async execute(userId: string): Promise<User | null> {
    const users = await this.userService.getUsers();
    return this.findUserById(users, userId);
  }

  private findUserById(users: User[], userId: string): User | null {
    return users.find(user => user.getIdUser() === userId) || null;
  }
}
