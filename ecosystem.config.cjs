const APP_DIR = process.env.APP_DIR || '/opt/kanak-setu';

module.exports = {
  apps: [
    {
      name: 'kanak-api',
      cwd: APP_DIR,
      script: 'npm',
      args: 'run start -w @kanak-setu/api',
      env: {
        NODE_ENV: 'production',
        PORT: '4000',
      },
    },
    {
      name: 'kanak-donor-web',
      cwd: APP_DIR,
      script: 'npm',
      args: 'run start -w @kanak-setu/donor-web',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
    },
    {
      name: 'kanak-institution-web',
      cwd: APP_DIR,
      script: 'npm',
      args: 'run start -w @kanak-setu/institution-web',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
      },
    },
    {
      name: 'kanak-admin-web',
      cwd: APP_DIR,
      script: 'npm',
      args: 'run start -w @kanak-setu/admin-web',
      env: {
        NODE_ENV: 'production',
        PORT: '3002',
      },
    },
  ],
};
