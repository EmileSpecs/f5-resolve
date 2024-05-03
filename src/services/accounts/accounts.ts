// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  accountDataValidator,
  accountPatchValidator,
  accountQueryValidator,
  accountResolver,
  accountExternalResolver,
  accountDataResolver,
  accountPatchResolver,
  accountQueryResolver
} from './accounts.schema'

import type { Application } from '../../declarations'
import { AccountService, getOptions } from './accounts.class'
import { accountPath, accountMethods } from './accounts.shared'
import { addUserToAccount } from './accounts.hooks'

export * from './accounts.class'
export * from './accounts.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const account = (app: Application) => {
  // Register our service on the Feathers application
  app.use(accountPath, new AccountService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: accountMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(accountPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(accountExternalResolver),
        schemaHooks.resolveResult(accountResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(accountQueryValidator), schemaHooks.resolveQuery(accountQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(accountDataValidator), schemaHooks.resolveData(accountDataResolver)],
      patch: [schemaHooks.validateData(accountPatchValidator), schemaHooks.resolveData(accountPatchResolver)],
      remove: []
    },
    after: {
      all: [],
      create: [addUserToAccount]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [accountPath]: AccountService
  }
}
