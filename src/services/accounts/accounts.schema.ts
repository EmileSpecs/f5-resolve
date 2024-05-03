// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, StringEnum, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { AccountService } from './accounts.class'

// Main data model schema
export const accountSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    context: StringEnum(['client', 'member']),
    bill_owner: Type.Boolean(),
    name: Type.Optional(Type.String()),
    email: Type.Optional(Type.String({ format: 'email' })),
    phone: Type.Optional(Type.String()),
    vat: Type.Optional(Type.String()),
    address: Type.Optional(Type.String()),
    suburb: Type.Optional(Type.String()),
    province: Type.Optional(Type.String()),
    city: Type.Optional(Type.String()),
    country: Type.Optional(Type.String()),
    postal_code: Type.Optional(Type.String()),
    // Schema references
    users: Type.Optional(Type.Array(Type.Unsafe<any>({})))
  },
  { $id: 'Account', additionalProperties: false }
)
export type Account = Static<typeof accountSchema>
export const accountValidator = getValidator(accountSchema, dataValidator)
export const accountResolver = resolve<Account, HookContext<AccountService>>({
  users: virtual(async (account, context) => {
    // Populate the users field with the actual user data
    const { resolve } = context.params
    const users = await context.app.service('users').find({ query: { account_id: account.id }, paginate: false, resolve })

    console.log('RESOLVING users in accounts...')

    return users?.length ? users : undefined
  }),
})
export const accountExternalResolver = resolve<Account, HookContext<AccountService>>({})

// Schema for creating new entries
export const accountDataSchema = Type.Pick(accountSchema, [
  'context', 'name', 'email', 'phone', 'vat', 'address', 'suburb', 'province', 'city', 'country', 'postal_code', 'bill_owner'
], {
  $id: 'AccountData'
})
export type AccountData = Static<typeof accountDataSchema>
export const accountDataValidator = getValidator(accountDataSchema, dataValidator)
export const accountDataResolver = resolve<Account, HookContext<AccountService>>({
  context: async (value, data, context) => {
    // Default account context to 'client' if not provided
    return value || 'client'
  },
})

// Schema for updating existing entries
export const accountPatchSchema = Type.Partial(accountSchema, {
  $id: 'AccountPatch'
})
export type AccountPatch = Static<typeof accountPatchSchema>
export const accountPatchValidator = getValidator(accountPatchSchema, dataValidator)
export const accountPatchResolver = resolve<Account, HookContext<AccountService>>({})

// Schema for allowed query properties
export const accountQueryProperties = Type.Pick(accountSchema, ['id', 'context'])
export const accountQuerySchema = Type.Intersect(
  [
    querySyntax(accountQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type AccountQuery = Static<typeof accountQuerySchema>
export const accountQueryValidator = getValidator(accountQuerySchema, queryValidator)
export const accountQueryResolver = resolve<AccountQuery, HookContext<AccountService>>({})
