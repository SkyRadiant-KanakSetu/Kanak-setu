import { execFileSync } from 'node:child_process';
import path from 'node:path';
import '../loadEnv';

const schemaPath = path.resolve(__dirname, '../../../../prisma/schema.prisma');
const prismaBin = path.resolve(__dirname, '../../../../node_modules/.bin/prisma');
execFileSync(prismaBin, ['db', 'push', `--schema=${schemaPath}`, '--skip-generate'], {
  stdio: 'inherit',
  env: process.env,
});
