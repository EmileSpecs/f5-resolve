// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'
import { defaults } from './defaults/defaults'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('permissions', (table) => {
    defaults(knex).id(table)

    table.string('name').notNullable()
    table.string('description')
    table.string('role').notNullable()
    table.string('context').defaultTo('user').notNullable()
    table.jsonb('rules').defaultTo('[]')

    defaults(knex).dates(table)

    table.unique(['name', 'role', 'context'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('permissions')
}
