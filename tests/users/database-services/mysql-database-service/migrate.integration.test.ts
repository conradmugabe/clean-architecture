import { describe, expect, test } from 'vitest';

import { migrate } from '@/users/database-services/mysql-database-service/migrate';
import { runningMysqlContainer } from '@tests/setup.integration';

describe('Test Mysql Database Connector Migrate', () => {
  const errorPort = 1000;

  interface TestCases {
    name: string;
    connectionUri?: string;
    error?: Error;
  }

  const testCases: TestCases[] = [
    {
      name: 'errors when an invalid connection string is provided',
      connectionUri: 'random string',
      error: new Error('Invalid URL'),
    },
    {
      name: 'errors when failed to connect to database',
      connectionUri: `mysql://localhost:${errorPort}`,
      error: new Error(`connect ECONNREFUSED ::1:${errorPort}`),
    },
    {
      name: 'migrates successfully',
    },
  ];

  test.each(testCases)('$name', async (testCase) => {
    const connectionUri =
      testCase.connectionUri || runningMysqlContainer.getConnectionUri();

    try {
      const db = await migrate(connectionUri);

      if (testCase.error) {
        expect.fail('test case should throw an error');
      }

      expect(db).toBeDefined();
    } catch (error) {
      if (!testCase.error) {
        expect.fail('test case should not throw an error');
      }

      expect(error).toEqual(testCase.error);
    }
  });
});
