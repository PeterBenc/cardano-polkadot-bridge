import {Pool, Client} from 'pg'

const credentials = {
  user: 'cexplorer',
  host: 'localhost',
  database: 'cardano',
  password: 'dbpass',
  port: 5432,
}

export class CardanoConnection {
  private pool: Pool

  constructor() {
    this.pool = new Pool(credentials)
  }

  subToNewHeads = async () => {
    let highestBlockId = 0
    while (true) {
      const now = await this.pool.query(
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
}
