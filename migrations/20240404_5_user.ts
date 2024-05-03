// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'
import { defaults } from './defaults/defaults'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    defaults(knex).id(table)
    defaults(knex).foreignKey(table, 'permissions')
    defaults(knex).foreignKey(table, 'accounts', true)

    table.boolean('is_onboarded').defaultTo(false)
    table.string('first_name')
    table.string('last_name')
    table.string('email').unique()
    table.string('phone').unique()
    table.string('password').notNullable()
    table.date('dob')
    table.string('address')
    table.string('suburb')
    table.string('city')
    table.string('province')
    table.string('country')
    table.string('postal_code')
    table.jsonb('onboarded').defaultTo('{}')

    defaults(knex).dates(table)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
