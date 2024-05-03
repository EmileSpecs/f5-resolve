// For more information about this file see https://dove.feathersjs.com/guides/cli/log-error.html
import { transaction } from '@feathersjs/knex'
import { logger } from '../logger'
import type { HookContext, NextFunction } from '../declarations'

// A hook that starts a transaction before the service method is called and ends it afterwards
export const transactions = async (context: HookContext, next: NextFunction) => {
  try {
    await transaction.start()(context)
    await next()
    await transaction.end()(context)
  } catch (err) {
    await transaction.rollback()(context)
    throw err
  }
}

// A hook to log errors to the console
export const logError = async (context: HookContext, next: NextFunction) => {
  try {
    await next()
  } catch (error: any) {
    logger.error(error.stack)

    // Log validation errors
    if (error.data) {
      logger.error('Data: %O', error.data)
    }

    throw error
  }
}
