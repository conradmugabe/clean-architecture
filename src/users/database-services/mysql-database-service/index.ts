import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';

import { UserDatabase } from '@/users/database-services';
import { User } from '@/users/core';
import { users as userSchema } from '@/users/database-services/mysql-database-service/schema';

export class MySqlUserDatabaseService extends UserDatabase {
  constructor(private db: MySql2Database<Record<string, never>>) {
    super();
  }

  async createUser(userId: string): Promise<User> {
    const users = await this.db
      .insert(userSchema)
      .values({ id: Number(userId) })
      .execute();

    console.log(users);
    console.log('user', users[0]);
    return { id: userId };
  }

  async findUsers(): Promise<User[]> {
    const users = await this.db.select().from(userSchema).execute();

    return users.map((user) => ({ ...user, id: String(user.id) }));
  }

  async findUserById(userId: string): Promise<User | null> {
    console.log('this', this.db);
    
    const users = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, Number(userId)))
      .execute();
    if (users.length === 0) {
      return null;
    }

    return { ...users[0], id: String(users[0].id) };
  }
}
