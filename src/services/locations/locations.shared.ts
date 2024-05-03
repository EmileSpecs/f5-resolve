// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Location, LocationData, LocationPatch, LocationQuery, LocationService } from './locations.class'

export type { Location, LocationData, LocationPatch, LocationQuery }

export type LocationClientService = Pick<
  LocationService<Params<LocationQuery>>,
  (typeof locationMethods)[number]
>

export const locationPath = 'locations'

export const locationMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const locationClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(locationPath, connection.service(locationPath), {
    methods: locationMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [locationPath]: LocationClientService
  }
}
