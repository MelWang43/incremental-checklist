import 'dotenv/config'
import { jwtVerify, createRemoteJWKSet } from 'jose'
import { createUserSupabase } from './supabase.js'

const SUPABASE_JWKS_URL = new URL(
    process.env.SUPABASE_JWKS_URL
)

const JWKS = createRemoteJWKSet(SUPABASE_JWKS_URL)

export async function authenticate(req, res, next) {
    try {
        const authorization = req.headers.authorization

        if (!authorization?.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Missing authorization token'
            })
        }

        const token = authorization.substring(7)

        const { payload } = await jwtVerify(token, JWKS)

        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role
        }

        req.accessToken = token

        req.supabase = createUserSupabase(token);

        next()

    } catch (error) {
        return res.status(401).json({
            error: 'Invalid or expired token'
        })
    }
}