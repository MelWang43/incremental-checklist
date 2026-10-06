import { jwtVerify } from 'jose'

const jwtSecret = new TextEncoder().encode(
  process.env.SUPABASE_JWKS_URL
)

export async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing authorization token'
      })
    }

    const token = authorization.substring(7)

    const { payload } = await jwtVerify(
      token,
      jwtSecret
    )

    // The Supabase user's UUID
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    }

    // Keep the token around so we can pass it
    // to Supabase later.
    req.accessToken = token

    next()
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid or expired token'
    })
  }
}

