import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/users/database-services/mysql-database-service/schema.ts',
  out: './drizzle',
  driver: 'mysql2',
} satisfies Config;
