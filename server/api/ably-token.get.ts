import * as Ably from 'ably'
import { auth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { ablyApiKey } = useRuntimeConfig()
  if (!ablyApiKey) {
    throw createError({ statusCode: 500, message: 'Ably API key missing in runtime config' })
  }

  const client = new Ably.Rest({ key: ablyApiKey })
  
  try {
    const tokenRequest = await client.auth.createTokenRequest({
      clientId: session.user.id
    })
    return tokenRequest
  } catch (error: any) {
    console.error('Failed to generate Ably token:', error)
    throw createError({ statusCode: 500, message: 'Failed to generate token' })
  }
})
