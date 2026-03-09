// middleware.js — Minimal route protection
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
    const res = NextResponse.next()
    const { pathname } = req.nextUrl

    // Only protect /dashboard, /tutorial, /settings
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/tutorial') || pathname.startsWith('/settings')) {
        try {
            const supabase = createMiddlewareClient({ req, res })
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                return NextResponse.redirect(new URL('/login', req.url))
            }
        } catch (_) {
            // On error, allow through — client will handle auth
        }
    }

    return res
}

export const config = {
    matcher: ['/dashboard/:path*', '/tutorial/:path*', '/settings/:path*'],
}
