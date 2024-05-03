import type { HookContext } from '../declarations'
import { defineAbilitiesFor } from '../authorization'

// Is this an authentication request?
export const isAuthenticating = (equalTo: boolean = false) => {
  return async (context: HookContext) => {
    const { params } = context
    const isAuthenticating = !!params.authenticating

    return equalTo === isAuthenticating
  }
}

// Define the abilities for the user
export const setAbilities = (context: HookContext) => {
  const { user } = context.params

  if (!user) return context

  const ability = defineAbilitiesFor(user)

  context.params.ability = ability
  context.params.rules = ability.rules

  return context
}

// Define the abilities for the user
export const setChannelAbilities = (context: HookContext) => {
  const { user } = context.result

  if (!user) return context

  const ability = defineAbilitiesFor(user)

  context.result.ability = ability;
  context.result.rules = ability.rules;

  return context
}

// Check if the hook is on a service
export const isService = (hasServices: boolean = false, ...services: any[]) => {
  return async (context: HookContext) => {
    let inServices = false

    services.forEach(service => {
      if (typeof service === 'string') {
        inServices = inServices || context.path === service
      }
      if (typeof service === 'object' && service !== null) {
        inServices = inServices || (context.path === service.path && context.method === service.method)
      }
    })

    return hasServices === inServices
  }
}