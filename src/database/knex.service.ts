import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Knex, knex as buildKnex } from 'knex';

@Injectable()
export class KnexService implements OnModuleDestroy {
  private readonly connection: Knex;

  constructor() {
    this.connection = buildKnex({
      client: 'mysql2',
      connection: {
        host: process.env.DB_HOST ?? '127.0.0.1',
        port: Number(process.env.DB_PORT ?? 3306),
        user: process.env.DB_USER ?? 'root',
        password: process.env.DB_PASSWORD ?? '',
        database: process.env.DB_NAME ?? 'my_coin_db',
      },
      pool: {
        min: Number(process.env.DB_POOL_MIN ?? 0),
        max: Number(process.env.DB_POOL_MAX ?? 10),
      },
    });
  }

  get client(): Knex {
    return this.connection;
  }

  async onModuleDestroy() {
    await this.connection.destroy();
  }
}
