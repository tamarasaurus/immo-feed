// import { Pool, QueryResult } from "pg";
import * as pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_HOST,
  ssl: false,
  max: 20,
  min: 4,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 1000,
})

export default {
  query: (text: string, values: any[]) => {
    console.log('query:', text, values)
    return pool.query(text, values)
  }
}
