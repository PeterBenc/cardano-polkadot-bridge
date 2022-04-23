import {Pool, Client} from 'pg'

const credentials = {
  user: 'cexplorer',
  host: 'localhost',
  database: 'cardano',
  password: 'dbpass',
  port: 5432,
}

// TODO export const subToNewHeads

export async function poolDemo() {
  const pool = new Pool(credentials)
  const now = await pool.query('SELECT * FROM epoch_stake limit 1;')
  await pool.end()

  return now
}
