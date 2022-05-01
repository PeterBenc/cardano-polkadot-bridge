import {Pool, Client} from 'pg'
import {wait} from '../utils'
import {RawCardanoBlock, ParachainBlock, RelaychainBlock} from './types'

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

  subToNewHeads = async (
    onNewBlock: (block: RawCardanoBlock) => Promise<void>,
  ) => {
    let highestBlockId = 0
    while (true) {
      const now = await this.pool.query(
        'SELECT id FROM block WHERE id=(select max(id) from block)',
      )
      const lastBlockId = Number(now.rows[0].id)
      if (lastBlockId > highestBlockId) {
        highestBlockId = lastBlockId
        console.log(`Cardano chain is at #${highestBlockId}`)
        // get all new blocks and iterate through them
        await onNewBlock(null)
        await wait(5000)
      }
      await wait(5000)
    }
  }

  submitNewParachainBlock = async (block: ParachainBlock) => {
    console.log('Submitted new parachain block', {block})
  }

  submitNewRelaychainBlock = async (block: RelaychainBlock) => {
    console.log('Submitted new relaychain block', {block})
  }
}
