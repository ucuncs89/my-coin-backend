require('dotenv').config();
require('ts-node/register');

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'my_coin_db',
    },
    pool: {
      min: Number(process.env.DB_POOL_MIN || 0),
      max: Number(process.env.DB_POOL_MAX || 10),
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: {
      min: Number(process.env.DB_POOL_MIN || 2),
      max: Number(process.env.DB_POOL_MAX || 10),
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations',
    },
  },
};
