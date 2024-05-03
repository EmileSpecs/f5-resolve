import { HookContext } from '../declarations'
import type { PermissionQuery } from '../services/permissions/permissions.schema'

/**
 * Return the default permission for a new user
 */
export const getDefaultPermission = async (context: HookContext<any>): Promise<string> => {
  const { user } = context.params
  let permissionQuery = { role: 'owner', context: 'client' } as Partial<PermissionQuery>

  if (user?.permission) {
    const userPermissionSlug = user.permission.role + '-' + user.permission.context

    switch (userPermissionSlug) {
      case 'system-user':
        permissionQuery = { role: 'system', context: 'user' }
        break
      case 'owner-client':
      case 'client-client':
        permissionQuery = { role: 'client', context: 'client' }
        break
      case 'owner-member':
      case 'member-member':
        permissionQuery = { role: 'member', context: 'member' }
        break
    }
  }

  const permission = await context.app.service('permissions').find({ query: permissionQuery, paginate: false })

  if (permission.length) {
    return permission[0].id
  }

  throw new Error('No default permission found')
}