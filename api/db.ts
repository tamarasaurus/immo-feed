import * as pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_HOST,
  ssl: false,
  max: 20,
  min: 4,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 1000,
})

const query = (text: string, values: any[]) => {
  return pool.query(text, values)
}

export default { query }
