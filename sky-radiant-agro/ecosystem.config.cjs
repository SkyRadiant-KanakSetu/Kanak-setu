module.exports = {
  apps: [
    {
      name: 'sky-radiant-agro-api',
      cwd: __dirname,
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 4100,
      },
    },
  ],
};
