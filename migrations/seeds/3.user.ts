import type { Knex } from 'knex'
import type { UserData } from '../../src/services/users/users.schema'

/**
 * Seed the users table with the Owner user.
 */
exports.seed = async function(knex: Knex) {
  const bcrypt = require('bcryptjs')
  const password = await bcrypt.hash('123', 10)

  const permissions = await knex('permissions').select().where({ role: 'system', context: 'user' })
  const permissionId = permissions?.length ? permissions[0].id : null

  const accounts = await knex('accounts').select().where({ name: 'David Luecke' })
  const accountId = accounts?.length ? accounts[0].id : null

  const users: UserData[] = [
    {
      permission_id: permissionId, account_id: accountId, is_onboarded: false, 
      first_name: 'David', last_name: 'Luecke', email: 'david@feathers.cloud', phone: '0123456789', password
    }
  ]

  return knex('users').insert(users)
  .onConflict()
  .ignore()
}