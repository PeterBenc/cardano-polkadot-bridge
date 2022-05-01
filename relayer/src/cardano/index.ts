import {Pool, Client} from 'pg'
import {sleep} from '../utils'
import {
  RawCardanoHeader,
  ParachainHeader,
  RelaychainHeader,
  Utxo,
} from './types'
import {utxoQuery} from './constants'

const credentials = {
  user: 'cexplorer',
  host: 'localhost',
  database: 'cardano',
  password: 'dbpass',
  port: 5432,
}

export class CardanoConnection {
  private pool: Pool
  private scriptAddress: string
  private account: {address: string; sign?: () => string}

  constructor(scriptAddress: string, accountAddress: string, keypair?: string) {
    this.pool = new Pool(credentials)
    this.scriptAddress = scriptAddress
    this.account = {address: accountAddress} // create sign funciton with private key
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
        await sleep(2000)
      }
      await sleep(2000)
    }
  }

  subToNewContractUtxos = async (onNewUtxo: (utxo: Utxo) => void) => {
    const getScriptUtxos = () => this.getUtxosForAddress(this.scriptAddress)
    let previousUtxos = await getScriptUtxos()
    while (true) {
      const utxos = await getScriptUtxos()
      const newUtxo = utxos.find((u) =>
        previousUtxos.every(
          (pu) => pu.tx_hash !== u.tx_hash && pu.tx_index !== u.tx_index,
        ),
      )
      previousUtxos = utxos
      if (newUtxo) {
        console.log('New utxos on script address')
        onNewUtxo(newUtxo)
        await sleep(5000)
      }
      await sleep(5000)
    }
  }

  submitNewParachainHeader = async (header: ParachainHeader) => {
    const utxos = await this.getUtxosForAddress(this.account.address)
    console.log('Submitted new parachain header')
  }

  submitNewRelaychainHeader = async (header: RelaychainHeader) => {
    const utxos = await this.getUtxosForAddress(this.account.address)
    console.log('Submitted new relaychain header')
  }

  getUtxosForAddress = async (address: string) => {
    return (
      await this.pool.query({
        text: utxoQuery,
        values: [
          ['addr_test1vzvew0vvg5rc7wyd8kn559yv4rnstv638qzhthap0aegp4q449ncr'],
        ],
      })
    ).rows as Utxo[]
  }
}
