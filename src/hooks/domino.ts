import type { HookContext } from '../declarations'

// A hook to mark onboarded steps as completed
export const onboarded = async (context: HookContext) => {
  const { app, params } = context
  const { transaction, customServerParam } = params

  // Check if the user is logged in and if the custom onboarded parameter is set
  if (params.user && customServerParam?.onboarded) {
    const user = await app.service('users').get(params.user.id)
    const onboarded = { ...user.onboarded }

    // Mark the onboarded step as completed
    onboarded[customServerParam.onboarded] = true

    // Update the account with the new onboarded steps
    await app.service('users').patch(user.id, { onboarded }, { transaction })
  }

  return context
}
