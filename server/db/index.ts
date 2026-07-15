import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

// Use Neon's HTTP driver — works over plain HTTPS (port 443) and bypasses
// any TCP/SSL/DNS quirks with the postgres.js WebSocket transport.
const sql = neon(connectionString)
export const db = drizzle(sql, { schema })
