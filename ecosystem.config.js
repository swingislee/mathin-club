module.exports = {
    apps: [
      {
        name: "mathin-club",
        script: "npm",
        args: "start",
        env: {
          NODE_ENV: "production",
        },
        autorestart: true,
        watch: false,
        max_memory_restart: '2G',
        env_production: {
          NODE_ENV: "production"
        }
      }
    ]
  };
  