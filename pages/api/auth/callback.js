// pages/api/auth/callback.js — Supabase OAuth email confirmation handler
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
    const { code } = req.query

    if (code) {
        const supabase = createServerSupabaseClient({ req, res })
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Check tutorial status and redirect accordingly
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('tutorial_completed')
                    .eq('id', session.user.id)
                    .single()

                if (profile && !profile.tutorial_completed) {
                    return res.redirect('/tutorial')
                }
                return res.redirect('/dashboard')
            }
        }
    }

    res.redirect('/login?error=auth_callback_failed')
}
