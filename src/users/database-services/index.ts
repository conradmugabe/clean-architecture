import { User } from '@/users/core';

export abstract class UserDatabase {
  abstract findUsers(): Promise<User[]>;

  abstract findUserById(userId: string): Promise<User | null>;
}
