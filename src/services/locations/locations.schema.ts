// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { LocationService } from './locations.class'

// Main data model schema
export const locationSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    account_id: Type.String({ format: 'uuid' }),
    name: Type.String()
  },
  { $id: 'Location', additionalProperties: false }
)
export type Location = Static<typeof locationSchema>
export const locationValidator = getValidator(locationSchema, dataValidator)
export const locationResolver = resolve<Location, HookContext<LocationService>>({})

export const locationExternalResolver = resolve<Location, HookContext<LocationService>>({})

// Schema for creating new entries
export const locationDataSchema = Type.Pick(locationSchema, ['name'], {
  $id: 'LocationData'
})
export type LocationData = Static<typeof locationDataSchema>
export const locationDataValidator = getValidator(locationDataSchema, dataValidator)
export const locationDataResolver = resolve<Location, HookContext<LocationService>>({})

// Schema for updating existing entries
export const locationPatchSchema = Type.Partial(locationSchema, {
  $id: 'LocationPatch'
})
export type LocationPatch = Static<typeof locationPatchSchema>
export const locationPatchValidator = getValidator(locationPatchSchema, dataValidator)
export const locationPatchResolver = resolve<Location, HookContext<LocationService>>({})

// Schema for allowed query properties
export const locationQueryProperties = Type.Pick(locationSchema, ['id', 'account_id'])
export const locationQuerySchema = Type.Intersect(
  [
    querySyntax(locationQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type LocationQuery = Static<typeof locationQuerySchema>
export const locationQueryValidator = getValidator(locationQuerySchema, queryValidator)
export const locationQueryResolver = resolve<LocationQuery, HookContext<LocationService>>({})
