import { validateAccessToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  try {
    const authorization = getHeader(event, 'authorization')
    const cookieToken = getCookie(event, 'access_token')
    const token = authorization?.replace('Bearer ', '') || cookieToken

    if (!token) {
      throw createError({ statusCode: 401, statusMessage: 'Access token is required' })
    }

    const user = validateAccessToken(token)
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid or expired access token' })
    }

    return {
      user
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
