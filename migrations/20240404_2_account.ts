// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'
import { defaults } from './defaults/defaults'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('accounts', (table) => {
    defaults(knex).id(table)

    table.enum('context', ['client', 'member']).notNullable()
    table.boolean('bill_owner').defaultTo(true).notNullable()
    table.string('name')
    table.string('email').unique()
    table.string('phone').unique()
    table.string('vat')
    table.string('address')
    table.string('suburb')
    table.string('city')
    table.string('province')
    table.string('country')
    table.string('postal_code')

    defaults(knex).dates(table)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('accounts')
}
