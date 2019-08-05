import db from './db'
import { QueryResult } from 'pg'

db.query(
    `CREATE TABLE IF NOT EXISTS results(
      id SERIAL,
      name TEXT NOT NULL,
      description TEXT,
      size FLOAT,
      price INTEGER,
      link TEXT PRIMARY KEY,
      created timestamp NOT NULL DEFAULT current_timestamp,
      updated timestamp NOT NULL DEFAULT current_timestamp,
      photo TEXT,
      hidden BOOLEAN NOT NULL DEFAULT false
     )`, [])
    .then((results: QueryResult) => {
      console.log('Finished setting up database \n', results)
    })
    .catch((error: Error) => {
      console.error('Error setting up database table \n', error)
    })
