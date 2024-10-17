import { Injectable, Inject } from "@nestjs/common";

import { UserService, UserServiceKey } from "../ports/user.port";
import { User } from "src/domain/entities/user";

@Injectable()

export class SupprUser {
  constructor(
    @Inject(UserServiceKey)
    private userService: UserService
  ) {}

  async execute(userId: string): Promise<User[] | null> {
    return this.userService.SupprUser(userId)
  }
}
