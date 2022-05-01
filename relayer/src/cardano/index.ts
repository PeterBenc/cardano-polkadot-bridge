import {Pool, Client} from 'pg'
import {wait} from '../utils'
import {RawCardanoHeader, ParachainHeader, RelaychainHeader} from './types'

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
    onNewHeader: (block: RawCardanoHeader) => Promise<void>,
  ) => {
    let highestBlockId = 0
    while (true) {
      const now = await this.pool.query(
        'SELECT id, hash FROM block WHERE id=(select max(id) from block)',
      )
      const lastBlockId = Number(now.rows[0].id)
      if (lastBlockId > highestBlockId) {
        highestBlockId = lastBlockId
        console.log(`Cardano chain is at #${highestBlockId}`)
        //TODO: get all new blocks and iterate through them
        await onNewHeader({id: lastBlockId, hash: now.rows[0].hash})
        await wait(10000)
      }
      await wait(10000)
    }
  }

  submitNewParachainHeader = async (header: ParachainHeader) => {
    console.log('Submitted new parachain header')
  }

  submitNewRelaychainHeader = async (header: RelaychainHeader) => {
    console.log('Submitted new relaychain header')
  }
}
