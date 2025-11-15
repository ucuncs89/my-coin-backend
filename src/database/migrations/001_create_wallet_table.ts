import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('wallet', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('api_key').notNullable();
    table.string('wallet_public_key').notNullable();
    table.string('private_key').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('wallet');
}

