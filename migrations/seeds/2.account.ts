import type { Knex } from 'knex'
import type { AccountData } from '../../src/services/accounts/accounts.schema'

/**
 * Seed the accounts table with the Owner account.
 */
exports.seed = async function(knex: Knex) {
  const accounts: AccountData[] = [
    {
      context: 'client', bill_owner: true, name: 'David Luecke'
    }
  ]

  return knex('accounts').insert(accounts)
  .onConflict()
  .ignore()
}