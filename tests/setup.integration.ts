import { afterAll, beforeAll, beforeEach } from 'vitest';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { migrate } from '@/users/database-services/mysql-database-service/migrate';
import { users as userSchema } from '@/users/database-services/mysql-database-service/schema';

const SIXTY_SECONDS = 60 * 1000;

let db: MySql2Database<Record<string, never>>;

let container: MySqlContainer = new MySqlContainer();
let startedContainer: StartedMySqlContainer;

beforeAll(async () => {
  startedContainer = await container.start();

  db = await migrate(startedContainer.getConnectionUri());
}, SIXTY_SECONDS);

afterAll(async () => {
  await startedContainer.stop();
}, SIXTY_SECONDS);

export { db as mysqlDB, startedContainer as runningMysqlContainer };
