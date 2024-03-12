import { User } from '@/users/core';
import { UserDatabase } from '@/users/database-services';
import { NotFoundError } from '@/utils/errors/not-found-error';
import { BadRequestError } from '@/utils/errors/bad-request-error';

export class UserUseCases {
  constructor(private database: UserDatabase) {}

  async createUser(userId: string): Promise<User> {
    const existingUser = await this.database.findUserById(userId);
    if (existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }

    const user = this.database.createUser(userId);

    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.database.findUsers();

    return users;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.database.findUserById(userId);
    if (!user) {
      throw new NotFoundError(`User ${userId}`);
    }

    return user;
  }
}
