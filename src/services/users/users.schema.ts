// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { StringEnum, Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { interpolate } from '../../helpers/interpolate'
import { getDefaultPermission } from '../../helpers/permission'
import type { UserService } from './users.class'

// Main data model schema
export const userSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    permission_id: Type.String({ format: 'uuid', $schema: 'Permission' }),
    account_id: Type.Optional(Type.String({ format: 'uuid', $schema: 'Account' })),
    context: StringEnum(['user', 'client', 'member']),
    first_name: Type.String(),
    last_name: Type.String(),
    email: Type.String({ format: 'email' }),
    phone: Type.String(),
    password: Type.Optional(Type.String()),
    dob: Type.Optional(Type.String({ format: 'date' })),
    address: Type.Optional(Type.String()),
    suburb: Type.Optional(Type.String()),
    city: Type.Optional(Type.String()),
    province: Type.Optional(Type.String()),
    country: Type.Optional(Type.String()),
    postal_code: Type.Optional(Type.String()),
    onboarded: Type.Record(Type.String(), Type.Boolean()),
    is_onboarded: Type.Boolean(),
    // Schema references
    permission: Type.Optional(Type.Unsafe<any>({})),
    account: Type.Optional(Type.Unsafe<any>({}))
  },
  { $id: 'User', additionalProperties: false }
)
export type User = Static<typeof userSchema>
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve<User, HookContext<UserService>>({
  permission: virtual(async (user, context) => {
    // Populate the permission field with the actual permission data
    const permission = await context.app.service('permissions').get(user.permission_id)

    return interpolate(permission, { user })
  }),
  account: virtual(async (user, context) => {
    // Populate the account field with the actual account data
    if (!user.account_id) {
      return
    }
    const { resolve, transaction } = context.params

    console.log('RESOLVING account in users...')

    return await context.app.service('accounts').get(user.account_id, { resolve, transaction })
  })
})

export const userExternalResolver = resolve<User, HookContext<UserService>>({
  // The password should never be visible externally
  password: async () => undefined
})

// Schema for creating new entries
export const userDataSchema = Type.Pick(userSchema, [
  'permission_id', 'account_id', 'first_name', 'last_name', 'email', 'phone', 'password', 'dob', 'address', 'suburb', 'city', 'province', 'country', 'postal_code', 'is_onboarded'
], {
  $id: 'UserData'
})
export type UserData = Static<typeof userDataSchema>
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve<User, HookContext<UserService>>({
  account_id: async (value, data, context) => {
    // Default to the user account
    return context.params.user?.account_id
  },
  permission_id: async (value, data, context) => {
    if (value) {
      return value
    }

    // Default user permission
    return await getDefaultPermission(context)
  },
  is_onboarded: async (value, data, context) => {
    // If user is being created by another user, they are onboarded
    if (context.params.user) {
      return true
    }
  },
  password: passwordHash({ strategy: 'local' })
})

// Schema for updating existing entries
export const userPatchSchema = Type.Partial(userSchema, {
  $id: 'UserPatch'
})
export type UserPatch = Static<typeof userPatchSchema>
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve<User, HookContext<UserService>>({
  is_onboarded: async (value, data, context) => {
    // If all onboarded steps are completed, the user is onboarded
    const onboardingSteps = ['profile', 'account', 'subscription', 'classes', 'packages', 'location', 'team', 'payment']

    if (!data.onboarded) return value

    return onboardingSteps.every(step => data.onboarded[step])
  },
  password: passwordHash({ strategy: 'local' })
})

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, ['id', 'account_id', 'email'])
export const userQuerySchema = Type.Intersect(
  [
    querySyntax(userQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type UserQuery = Static<typeof userQuerySchema>
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve<UserQuery, HookContext<UserService>>({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  id: async (value, user, context) => {
    if (context.params.user) {
      return context.params.user.id
    }

    return value
  }
})
