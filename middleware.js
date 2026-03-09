// middleware.js — Route protection for OUStudyJapan
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/sign-up', '/api/auth/callback']

export async function middleware(req) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()
    const { pathname } = req.nextUrl

    // Allow public routes and API routes
    if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/api/')) {
        // If already logged in, redirect away from login/signup
        if (session && (pathname === '/login' || pathname === '/sign-up')) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('tutorial_completed')
                .eq('id', session.user.id)
                .single()

            if (profile && !profile.tutorial_completed) {
                return NextResponse.redirect(new URL('/tutorial', req.url))
            }
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
        return res
    }

    // All other routes require authentication
    if (!session) {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('redirected', '1')
        return NextResponse.redirect(loginUrl)
    }

    // For /tutorial — must be logged in (no tutorial check needed here)
    if (pathname === '/tutorial') {
        return res
    }

    // For /dashboard — must have completed tutorial
    if (pathname === '/dashboard' || pathname === '/settings') {
        const { data: profile } = await supabase
            .from('profiles')
            .select('tutorial_completed')
            .eq('id', session.user.id)
            .single()

        if (profile && !profile.tutorial_completed) {
            return NextResponse.redirect(new URL('/tutorial', req.url))
        }
    }

    return res
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
