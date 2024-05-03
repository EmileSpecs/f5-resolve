import type { Knex } from 'knex'
import type { PermissionData } from '../../src/services/permissions/permissions.schema'

/**
 * Seed the permissions table with the Owner permission.
 */
exports.seed = function(knex: Knex) {
  const permissions: PermissionData[] = [
    { name: 'System', description: 'Full access restricted to developers', role: 'system', context: 'user',
      rules: JSON.stringify([
        { subject: 'all', action: 'manage' }
      ])
    }
  ];

  return knex('permissions').insert(permissions)
  .onConflict()
  .ignore();
};