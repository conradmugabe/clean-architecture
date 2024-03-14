import { beforeEach, describe, expect, test } from 'vitest';

import { MySqlUserDatabaseService } from '@/users/database-services/mysql-database-service';
import { users as userSchema } from '@/users/database-services/mysql-database-service/schema';
import { User } from '@/users/core';

import { mysqlDB } from '@tests/setup.integration';
import { tenUsers } from '@tests/users/database-services/test_data';

beforeEach(async () => {
  await mysqlDB.delete(userSchema);
});

describe('Test MySqlUserDatabaseService', () => {
  const userDatabase = new MySqlUserDatabaseService(mysqlDB);

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
    await mysqlDB
      .insert(userSchema)
      .values(tenUsers.map((user) => ({ ...user, id: Number(user.id) })));
  });

  test.each(testCases)('$name', async (testCase) => {
    const userDatabase = new MySqlUserDatabaseService(mysqlDB);

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
    const userDatabase = new MySqlUserDatabaseService(mysqlDB);

    const actual = await userDatabase.findUsers();

    expect(actual).toEqual(testCase.expected);
    expect(actual.length).toEqual(testCase.expectedLength);
  });
});

describe('Test MySqlUserDatabaseService.createUser', () => {
  interface TestCase {
    name: string;
    userId: string;
    expected: User;
  }

  const testCases: TestCase[] = [
    { name: 'creates a new user', userId: '1', expected: { id: '1' } },
    { name: 'creates a new user', userId: '100', expected: { id: '100' } },
  ];

  test.each(testCases)('$name', async (testCase) => {
    const userDatabase = new MySqlUserDatabaseService(mysqlDB);

    const actual = await userDatabase.createUser(testCase.userId);

    expect(actual).toEqual(testCase.expected);
  });
});
