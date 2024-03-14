import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { migrate } from '@/users/database-services/mysql-database-service/migrate';
import { MySqlUserDatabaseService } from '@/users/database-services/mysql-database-service';
import { users as userSchema } from '@/users/database-services/mysql-database-service/schema';
import { User } from '@/users/core';

import { tenUsers } from '../test_data';

let db: MySql2Database<Record<string, never>>;

let container: MySqlContainer = new MySqlContainer();
let startedContainer: StartedMySqlContainer;

const SIXTY_SECONDS = 60 * 1000;

beforeAll(async () => {
  startedContainer = await container.start();

  db = await migrate(startedContainer.getConnectionUri());
}, SIXTY_SECONDS);

afterAll(async () => {
  await startedContainer.stop();
}, SIXTY_SECONDS);

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

describe('Test MySqlUserDatabaseService.findUsers', () => {
  interface TestCase {
    name: string;
    expected: User[];
    expectedLength: number;
  }

  const testCases: TestCase[] = [
    { name: 'returns all users', expected: [], expectedLength: 0 },
  ];

  test.each(testCases)('$name', async (testCase) => {
    const userDatabase = new MySqlUserDatabaseService(db);

    const actual = await userDatabase.findUsers();

    expect(actual).toEqual(testCase.expected);
    expect(actual.length).toEqual(testCase.expectedLength);
  });
});
