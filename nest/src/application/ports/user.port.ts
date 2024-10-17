import { User } from "src/domain/entities/user";

export const UserServiceKey = 'USER_PORT';
export interface UserService {
  addUser: (userData: { firstName: string; lastName: string; }) => Promise<User>;
  getUsers: () => Promise<User[]>;
  SupprUser: (user: string) => Promise<User[]>;
}
