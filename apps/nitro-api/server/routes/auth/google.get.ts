import { createError, defineEventHandler, getQuery, sendRedirect, setCookie } from 'h3'
import { generateState, generateCodeVerifier } from 'arctic'
import {
    getCanonicalOAuthStartUrl,
    getGoogleOAuth,
    getOAuthCookieOptions,
    setOAuthNoStoreHeaders,
} from '../../utils/oauth'
import { applyCors } from '../../utils/cors'

export default defineEventHandler(async (event) => {
    applyCors(event)
    setOAuthNoStoreHeaders(event)

    try {
        const canonicalUrl = getCanonicalOAuthStartUrl(event, 'google')
        if (canonicalUrl) {
            return sendRedirect(event, canonicalUrl)
        }

        const query = getQuery(event)
        const isNative = query.native === '1'

        const google = getGoogleOAuth()
        const rawState = generateState()
        const state = isNative ? `${rawState}.native` : rawState
        const codeVerifier = generateCodeVerifier()
        const baseOpts = getOAuthCookieOptions(event)
        const isSecure = baseOpts.secure

        const cookieOpts = {
            ...baseOpts,
            sameSite: (isSecure ? 'none' : baseOpts.sameSite) as 'none' | 'lax',
            secure: isSecure,
        }

        // Store state + PKCE verifier in cookies for CSRF protection
        setCookie(event, 'google_oauth_state', state, cookieOpts)
        setCookie(event, 'google_code_verifier', codeVerifier, cookieOpts)

        // Track native app requests so the callback can redirect to the custom URL scheme
        if (isNative) {
            setCookie(event, 'oauth_from_native', '1', {
                ...cookieOpts,
                maxAge: 600,
            })
        }

        const url = google.createAuthorizationURL(state, codeVerifier, ['openid', 'profile', 'email'])

        return sendRedirect(event, url.toString())
    } catch (error: any) {
        console.error('[auth/google] OAuth initiation error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Google OAuth error: ${error?.message || 'unknown'}`
        })
    }
})
