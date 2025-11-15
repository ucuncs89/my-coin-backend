import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('queue_job_coin', (table) => {
    table.increments('id').primary();
    table.string('status').notNullable();
    table.integer('wallet_id').nullable();
    table.integer('coin_id').nullable();
    table.timestamp('called_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('queue_job_coin');
}
