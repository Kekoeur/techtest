import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserServiceKey } from "./application/ports/user.port";
import { AddUser } from "./application/use-cases/addUser";
import { GetAllUsers } from "./application/use-cases/getAllUsers";
import { UserController } from "./controllers/user.controller";
import { UserAdapter } from "./repositories/adapters/user.adapter";
import { UserSchema } from "./repositories/schemas/user.schema";
import { SupprUser } from "./application/use-cases/SupprUser";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema]),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    {
      provide: UserServiceKey,
      useClass: UserAdapter,
    },
    GetAllUsers,
    AddUser,
    SupprUser
  ],
})
export class UserModule {}
  