import { User } from '@/users/core';

export abstract class UserDatabase {
  abstract createUser(userId: string): Promise<User>;

  abstract findUsers(): Promise<User[]>;

  abstract findUserById(userId: string): Promise<User | null>;
}
