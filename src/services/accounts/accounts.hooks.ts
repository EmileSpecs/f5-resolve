import type { HookContext } from '../../declarations'
import type { AccountService } from './accounts.class'
import type { Account } from './accounts.schema'

// Hook to patch user when account has been created
export const addUserToAccount = async (context: HookContext<AccountService>) => {
  const { result, params, app } = context
  const { user, transaction } = params
  const account = result as Account

  if (!user?.id) return context

  // Add the user to the account
  await app.service('users').patch(user.id, { account_id: account.id }, { transaction })

  return context
}