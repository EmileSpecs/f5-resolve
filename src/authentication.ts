// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationService, AuthenticationRequest, AuthenticationParams, AuthenticationResult, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { setChannelAbilities } from './hooks/authentication'

import type { Application } from './declarations'

class MyAuthService extends AuthenticationService {
  async authenticate(authentication: AuthenticationRequest, params: AuthenticationParams, ...allowed: string[]): Promise<AuthenticationResult> {
    // Identify this as an authorization request to the user service so we're allowed to get the user
    params.authenticating = true

    return super.authenticate(authentication, params, ...allowed)
  }
}

declare module './declarations' {
  interface ServiceTypes {
    authentication: MyAuthService
  }
}

export const authentication = (app: Application) => {
  const authentication = new MyAuthService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('authentication', authentication)

  app.service('authentication').hooks({
    after: {
      create: [setChannelAbilities]
    }
  })
}
