import { execSync } from 'node:child_process';
import path from 'node:path';
import '../loadEnv';

const schemaPath = path.resolve(__dirname, '../../../../prisma/schema.prisma');
execSync(`npx prisma db push --schema="${schemaPath}" --skip-generate`, {
  stdio: 'inherit',
  env: process.env,
});
