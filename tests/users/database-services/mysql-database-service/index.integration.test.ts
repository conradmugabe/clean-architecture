import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { MySqlUserDatabaseService } from '@/users/database-services/mysql-database-service';
import { User } from '@/users/core';
import { users as userSchema } from '@/users/database-services/mysql-database-service/schema';

import { tenUsers } from '../test_data';

console.log('Welcome to this integration testing suite');

let db: MySql2Database<Record<string, never>>;

let container: MySqlContainer = new MySqlContainer();
let startedContainer: StartedMySqlContainer;

beforeAll(async () => {
  console.log('Starting containers...');
  startedContainer = await container.start();

  console.log('Started containers...');
  console.log(
    `Connecting to database on ${startedContainer.getConnectionUri()}...`
  );

  const connection = mysql.createPool(startedContainer.getConnectionUri());
  db = drizzle(connection);
});

afterAll(async () => {
  await startedContainer.stop();
});

describe('Test MySqlUserDatabaseService', () => {
  const userDatabase = new MySqlUserDatabaseService(db);

  test('should initialize', () => {
    expect(userDatabase).toBeDefined();
    expect(userDatabase).toBeInstanceOf(MySqlUserDatabaseService);
  });
});

describe('Test MySqlUserDatabaseService.findUserById', () => {
  interface TestCase {
    name: string;
    userId: string;
    expected: User | null;
  }

  const testCases: TestCase[] = [
    {
      name: 'returns user with id 1',
      userId: '1',
      expected: { id: '1' },
    },
    {
      name: 'returns null for user with id 100',
      userId: '100',
      expected: null,
    },
  ];

  beforeEach(async () => {
    await db.delete(userSchema);

    await db
      .insert(userSchema)
      .values(tenUsers.map((user) => ({ ...user, id: Number(user.id) })));
  });

  test.each(testCases)('$name', async (testCase) => {
    const userDatabase = new MySqlUserDatabaseService(db);

    const actual = await userDatabase.findUserById(testCase.userId);

    expect(actual).toEqual(testCase.expected);
  });
});
