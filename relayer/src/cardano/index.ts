import {Pool, Client} from 'pg'
import {sleep} from '../utils'
import {
  RawCardanoHeader,
  ParachainHeader,
  RelaychainHeader,
  Utxo,
} from './types'
import {utxoQuery} from './constants'
import {submitTx} from './tx/submit'
import {buildTx} from './tx/plan'

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
  private userAddress: string
  private relayerAccount: {
    address: string
    privKeyHex: string
    pubKeyHex: string
  }
  private polkadotHeaders: (ParachainHeader | RelaychainHeader)[] = []
  private submitting = false

  constructor(
    scriptAddress: string,
    userAddress: string,
    relayerAddress: string,
    relayerPrivKeyHex: string,
    relayerPubKeyHex: string,
  ) {
    this.pool = new Pool(credentials)
    this.scriptAddress = scriptAddress
    this.relayerAccount = {
      address: relayerAddress,
      privKeyHex: relayerPrivKeyHex,
      pubKeyHex: relayerPubKeyHex,
    }
    this.userAddress = userAddress
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
        previousUtxos.every((pu) => pu.tx_hash !== u.tx_hash),
      )
      previousUtxos = [...utxos]
      if (newUtxo) {
        console.log('New utxos on script address')
        onNewUtxo(newUtxo)
        await sleep(5000)
      }
      await sleep(5000)
    }
  }

  submitNewPolkadotHeader = async (
    header: ParachainHeader | RelaychainHeader,
  ) => {
    this.polkadotHeaders.push(header)
    if (!this.submitting) {
      this.submitting = true
      const utxos = await this.getUtxosForAddress(this.relayerAccount.address)
      console.log({utxos})
      const utxo = utxos[utxos.length - 1]
      const headersToSubmit = [...this.polkadotHeaders]
      this.polkadotHeaders = []
      const tx = buildTx(
        utxo,
        this.relayerAccount.privKeyHex,
        this.relayerAccount.address,
        this.scriptAddress,
        null,
      )
      console.log(await submitTx(tx))
      console.log(
        `Submitted new ${headersToSubmit.length} parachain and relaychain headers`,
      )
      setTimeout(() => (this.submitting = false), 200000)
    }
  }

  getUtxosForAddress = async (address: string) => {
    return (
      await this.pool.query({
        text: utxoQuery,
        values: [[address]],
      })
    ).rows as Utxo[]
  }

  unlockAsset = async () => {
    const utxos = await this.getUtxosForAddress(this.relayerAccount.address)
    const utxo = utxos[utxos.length - 1]
    const scriptUtxos = await this.getUtxosForAddress(this.scriptAddress)
    const scriptUtxo = scriptUtxos[scriptUtxos.length - 1]

    const tx = buildTx(
      utxo,
      this.relayerAccount.privKeyHex,
      this.relayerAccount.address,
      this.userAddress, // TODO: user address
      scriptUtxo,
    )
    await submitTx(tx)
  }
}
