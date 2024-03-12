import { beforeEach, describe, expect, test } from 'vitest';
import { MockProxy, mock } from 'vitest-mock-extended';

import { UserUseCases } from '@/users/user-use-cases';
import { User } from '@/users/core';
import { UserDatabase } from '@/users/database-services';
import { NotFoundError } from '@/utils/errors/not-found-error';
import { BadRequestError } from '@/utils/errors/bad-request-error';

import { fourUsers, tenUsers } from './test-data';

let mockUserDatabase: MockProxy<UserDatabase>;

beforeEach(() => {
  mockUserDatabase = mock<UserDatabase>();
});

describe('Test UserUseCases', {}, () => {
  const userUseCases = new UserUseCases(mockUserDatabase);

  test('should initialize', () => {
    expect(userUseCases).toBeDefined();
    expect(userUseCases).toBeInstanceOf(UserUseCases);
  });
});

describe('Test UserUseCases.getUserById', () => {
  const userUseCases = new UserUseCases(mockUserDatabase);

  interface TestCase {
    name: string;
    userId: string;
    databaseReturn: User | null;
    expected?: User;
    error?: NotFoundError;
  }

  const testCases: TestCase[] = [
    {
      name: 'returns user with id 1',
      userId: '1',
      databaseReturn: { id: '1' },
      expected: { id: '1' },
    },
    {
      name: 'throws an error `User 4 not found`',
      userId: '4',
      databaseReturn: null,
      error: new NotFoundError('User 4'),
    },
    {
      name: 'returns user with id 3',
      userId: '3',
      databaseReturn: { id: '3' },
      expected: { id: '3' },
    },
    {
      name: 'throws an error `User 6 not found`',
      userId: '5',
      databaseReturn: null,
      error: new NotFoundError('User 5'),
    },
  ];

  test.each(testCases)('$name', async (testCase) => {
    const userUseCases = new UserUseCases(mockUserDatabase);
    mockUserDatabase.findUserById.mockResolvedValue(testCase.databaseReturn);

    try {
      const actual = await userUseCases.getUserById(testCase.userId);

      if (testCase.error) {
        expect.fail('test case should throw an error');
      }

      expect(actual).toEqual(testCase.expected);
    } catch (err) {
      if (!testCase.error) {
        expect.fail('test case should not throw an error');
      }

      expect(err).toEqual(testCase.error);
    }
  });
});

describe('Test UserUseCases.getUsers', () => {
  interface TestCase {
    name: string;
    databaseReturn: User[];
    expected: User[];
  }

  const testCases: TestCase[] = [
    {
      name: 'returns an empty array',
      databaseReturn: [],
      expected: [],
    },
    {
      name: `returns ${fourUsers.count} users`,
      databaseReturn: fourUsers.users,
      expected: fourUsers.users,
    },
    {
      name: `returns ${tenUsers.count} users`,
      databaseReturn: tenUsers.users,
      expected: tenUsers.users,
    },
  ];

  test.each(testCases)('$name', async ({ databaseReturn, expected, name }) => {
    const userUseCases = new UserUseCases(mockUserDatabase);
    mockUserDatabase.findUsers.mockResolvedValue(databaseReturn);

    const actual = await userUseCases.getUsers();

    expect(actual).toEqual(expected);
    expect(actual).toHaveLength(expected.length);
  });
});

describe('Test UserUseCases.createUser', () => {
  interface TestCase {
    name: string;
    input: string;
    findUserById: User | null;
    createUser?: User;
    expected?: User;
    error?: BadRequestError;
  }

  const testCases: TestCase[] = [
    {
      name: 'throws a BadRequestError `Invalid Credentials`',
      input: '4',
      findUserById: { id: '4' },
      error: new BadRequestError('Invalid Credentials'),
    },
    {
      name: 'returns user with id 5',
      input: '5',
      findUserById: null,
      createUser: { id: '5' },
      expected: { id: '5' },
    },
  ];

  test.each(testCases)('$name', async (testCase) => {
    const userUseCases = new UserUseCases(mockUserDatabase);
    mockUserDatabase.findUserById.mockResolvedValue(testCase.findUserById);

    if (testCase.createUser) {
      mockUserDatabase.createUser.mockResolvedValue(testCase.createUser);
    }

    try {
      const actual = await userUseCases.createUser(testCase.input);

      if (testCase.error) {
        expect.fail('test case should throw an error');
      }

      expect(actual).toEqual(testCase.expected);
    } catch (error) {
      if (!testCase.error) {
        expect.fail('test case should not throw an error');
      }

      expect(error).toEqual(testCase.error);
    }
  });
});
