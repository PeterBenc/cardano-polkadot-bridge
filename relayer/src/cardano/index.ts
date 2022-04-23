import {Pool, Client} from 'pg'

const credentials = {
  user: 'cexplorer',
  host: 'localhost',
  database: 'cardano',
  password: 'dbpass',
  port: 5432,
}

export const subToNewHeads = async () => {
  const pool = new Pool(credentials)
  let highestBlockId = 0
  while (true) {
    const now = await pool.query(
      'SELECT id FROM block WHERE id=(select max(id) from block)',
    )
    const lastBlockId = Number(now.rows[0].id)
    if (lastBlockId > highestBlockId) {
      highestBlockId = lastBlockId
      console.log(`Cardano chain is at ${highestBlockId}`)
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
    await new Promise((resolve) => setTimeout(resolve, 5000))
  }
}
