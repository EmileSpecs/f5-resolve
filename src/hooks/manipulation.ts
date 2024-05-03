import { randomUUID } from 'crypto'
import type { HookContext } from '../declarations'

// A hook to extract the custom parameter from the query and add it to the params object
export const customParameter = (context: HookContext) => {
  const { params } = context

  // Extract the custom parameter from the query
  if (params.query?.$customServerParam) {
    // Add the custom parameter to the params object
    params.customServerParam = params.query.$customServerParam

    // Remove the custom parameter from the query
    delete params.query.$customServerParam
  }

  return context
}

// A hook that generates a random UUID for the id field
export const generateId = (context: HookContext) => {
  const { data, service } = context

  context.data = {
    [service.id]: randomUUID(),
    ...data
  }

  return context
}

// A hook that filters the query based on the JSON path
export const jsonFilter = (context: HookContext) => {
  const { params, service } = context
  const { jsonFilter } = params.query

  if (jsonFilter) {
    const query = service.createQuery(params)

    jsonFilter.forEach(({column, prop, value}: any) => {
        query.andWhereJsonPath(column, `$.${prop}`, '=', value)
    })

    context.params.knex = query
}
  
  return context
}