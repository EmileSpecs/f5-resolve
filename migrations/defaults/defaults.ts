import type { Knex } from 'knex'

// Purpose: Default values for database fields.
export function defaults(knex: Knex) {
  // Purpose: Add an id field to a table.
  const id = (table: Knex.CreateTableBuilder) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
  }

  // Purpose: Add created_at and updated_at fields to a table.
  const dates = (table: Knex.CreateTableBuilder) => {
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  }

  // Purpose: Add a foreign key field to a table.
  const foreignKey = (table: Knex.CreateTableBuilder, fkTable: string, nullable: boolean = false) => {
    // If plural, remove the last character
    const fkTableId = fkTable.slice(-1) === 's' ? fkTable.slice(0, -1) + '_id' : fkTable + '_id'

    if (nullable) {
      table.uuid(fkTableId).references('id').inTable(fkTable).deferrable('deferred')
    } else {
      table.uuid(fkTableId).references('id').inTable(fkTable).deferrable('deferred').notNullable()
    }
  }

  return {
    id,
    dates,
    foreignKey
  }
}