// middleware.js — Route protection for OUStudyJapan
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/sign-up', '/api/auth/callback']

export async function middleware(req) {
    const res = NextResponse.next()
    const { pathname } = req.nextUrl

    // Always allow public routes and all API routes through
    if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/api/')) {
        return res
    }

    // For protected routes, check session
    try {
        const supabase = createMiddlewareClient({ req, res })
        const { data: { session } } = await supabase.auth.getSession()

        // Not logged in → send to login
        if (!session) {
            return NextResponse.redirect(new URL('/login', req.url))
        }

        // Tutorial page — just needs to be logged in
        if (pathname === '/tutorial') {
            return res
        }

        // Dashboard/settings — check tutorial completion
        if (pathname === '/dashboard' || pathname === '/settings') {
            try {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('tutorial_completed')
                    .eq('id', session.user.id)
                    .single()

                // Only redirect to tutorial if we KNOW tutorial is not done
                if (profile && profile.tutorial_completed === false) {
                    return NextResponse.redirect(new URL('/tutorial', req.url))
                }
            } catch (_) {
                // If profiles table doesn't exist yet, allow through
            }
        }
    } catch (_) {
        // On any auth error, allow through (client-side will handle it)
    }

    return res
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
