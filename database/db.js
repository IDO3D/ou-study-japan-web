// database/db.js — Serverless-optimized PostgreSQL pool
// Set DATABASE_URL to your Supabase pooler URI in Vercel env vars

const { Pool } = require('pg')

let pool = null

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      // Fail gracefully — all API routes have mock fallbacks
      return null
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Supabase pooler — keep connections short for serverless
      max: process.env.NODE_ENV === 'production' ? 2 : 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
    pool.on('error', (err) => {
      console.error('Unexpected DB pool error:', err.message)
    })
  }
  return pool
}

async function query(text, params) {
  const db = getPool()
  if (!db) throw new Error('DATABASE_URL not configured — using mock data')
  const res = await db.query(text, params)
  return res
}

module.exports = { query, getPool }
