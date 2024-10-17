import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from 'src/application/ports/user.port';
import { User } from 'src/domain/entities/user';
import { UserSchema } from '../schemas/user.schema';

@Injectable()

export class UserAdapter implements UserService {
  constructor(
    @InjectRepository(UserSchema)
    private usersRepository: Repository<User>,
  ) {}
 
  async addUser(userData: { firstName: string; lastName: string }): Promise<User> {
    const newUser = this.usersRepository.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    return await this.usersRepository.save(newUser);
  }
  
  getUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async SupprUser(userId: string): Promise<User[]> {
    await this.usersRepository.delete(userId);
    return await this.usersRepository.find();
  };
}
