import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/domain/entities/user';
import { UserService, UserServiceKey } from '../ports/user.port';

@Injectable()

export class AddUser {

  constructor(
    @Inject(UserServiceKey)
    private userService: UserService
  ) {}

  private normalizeString(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }

  private lowerNormalizeString(value: string): string {
    return this.normalizeString(value).toLowerCase();
  }

  async execute(userData: { firstName: string; lastName: string }): Promise<User | never> { 
    const users = await this.userService.getUsers();

    const firstName = this.normalizeString(userData.firstName);
    const lastName = this.normalizeString(userData.lastName);

    const NormalizeDataFirstName = this.lowerNormalizeString(userData.firstName);
    const NormalizeDataLastName = this.lowerNormalizeString(userData.lastName);
    
    const userExists = users.some(
      (user) => this.lowerNormalizeString(user.firstName) === NormalizeDataFirstName
      && this.lowerNormalizeString(user.lastName) === NormalizeDataLastName
    );
      
    if (userExists) {
      throw new HttpException({
        status: HttpStatus.CONFLICT, // Conflict = 409
        error: "L'utilisateur existe déjà.",
      }, HttpStatus.CONFLICT);
    }
  
    const maxId = Math.max(0, ...users.map(user => parseInt(user.id, 10)));
    const newId = (maxId + 1).toString();
    const newUser = new User(newId, firstName, lastName);
  
    try {
        await this.userService.addUser(newUser);
        return newUser;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR, // Internal server error = 500
        error: "Une erreur est survenue lors de l'ajout de l\'utilisateur.",
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

