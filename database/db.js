// database/db.js
// PostgreSQL connection pool

const { Pool } = require('pg')

let pool

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  }
  return pool
}

async function query(text, params) {
  const db = getPool()
  const start = Date.now()
  const res = await db.query(text, params)
  const duration = Date.now() - start
  if (process.env.NODE_ENV === 'development') {
    console.log('DB Query:', { text: text.substring(0, 60), duration, rows: res.rowCount })
  }
  return res
}

module.exports = { query, getPool }
