import { user } from './users/users'
import { account } from './accounts/accounts'
import { permission } from './permissions/permissions'
import { location } from './locations/locations'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  // All services will be registered here
  app.configure(user)
  app.configure(account)
  app.configure(permission)
  app.configure(location)
}
