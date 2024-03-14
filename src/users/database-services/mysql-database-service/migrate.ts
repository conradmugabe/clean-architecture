import * as mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate as mysqlMigrate } from 'drizzle-orm/mysql2/migrator';

export async function migrate(connectionUri: string) {
  const connection = await mysql.createConnection(connectionUri);
  const db = drizzle(connection);

  await mysqlMigrate(db, { migrationsFolder: './drizzle/' });

  return db;
}
