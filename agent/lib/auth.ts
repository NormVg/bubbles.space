/**
 * Extracts the authenticated userId from Eve's tool execution context.
 * 
 * This is the ONLY way tools should get the userId. Never extract it
 * from the chat message or let the AI model provide it.
 * 
 * The userId comes from the Eve channel's auth layer, which validates
 * the user's Better Auth session cookie on every request.
 */

interface EveToolContext {
  session: {
    auth: {
      current: {
        principalId: string
        principalType: string
        authenticator: string
        attributes?: Record<string, unknown>
      } | null
      initiator: {
        principalId: string
        principalType: string
        authenticator: string
        attributes?: Record<string, unknown>
      } | null
    }
  }
}

export function requireUserId(ctx: EveToolContext): string {
  const caller = ctx.session.auth.current
  if (!caller || !caller.principalId) {
    throw new Error(
      'Authentication required. The user is not logged in or the session has expired.'
    )
  }
  return caller.principalId
}
