module.exports = {
  apps: [
    {
      name: 'kanak-api',
      cwd: '/opt/kanak-setu',
      script: 'npm',
      args: 'run start -w @kanak-setu/api',
      env: {
        NODE_ENV: 'production',
        PORT: '4000',
      },
    },
    {
      name: 'kanak-donor-web',
      cwd: '/opt/kanak-setu',
      script: 'npm',
      args: 'run start -w @kanak-setu/donor-web',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
    },
    {
      name: 'kanak-institution-web',
      cwd: '/opt/kanak-setu',
      script: 'npm',
      args: 'run start -w @kanak-setu/institution-web',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
      },
    },
    {
      name: 'kanak-admin-web',
      cwd: '/opt/kanak-setu',
      script: 'npm',
      args: 'run start -w @kanak-setu/admin-web',
      env: {
        NODE_ENV: 'production',
        PORT: '3002',
      },
    },
  ],
};
