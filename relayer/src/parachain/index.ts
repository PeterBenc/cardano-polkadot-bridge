import '@polkadot/api-augment'
import {ApiPromise, WsProvider, Keyring} from '@polkadot/api'
import {CardanoHeader, RawParachainHeader} from './types'
import * as x from '@polkadot/api'
export class ParachainConnection {
  private _api: ApiPromise | null = null
  private provider: WsProvider
  private _account: ReturnType<x.Keyring['addFromUri']> | null = null
  private pendingHeaders: CardanoHeader[] = []
  private txPending: boolean = false

  private x = true

  constructor(wsEndpoint: string) {
    this.provider = new WsProvider(wsEndpoint)
  }

  init = async () => {
    await this.api()
    this.signIn()
  }

  private api = async () => {
    if (!this._api) {
      const a = await ApiPromise.create({
        provider: this.provider,
      })
      this._api = a
    }
    return this._api
  }

  private signIn = () => {
    this._account = new Keyring({type: 'sr25519'}).addFromUri('//Alice', {
      name: 'Alice',
    })
  }

  private account = () => {
    if (!this._account) {
      throw new Error('Not signed in to parachain')
    }
    return this._account
  }

  subToNewHeads = async (
    onNewHeader: (block: RawParachainHeader) => Promise<void>,
  ) => {
    const api = await this.api()
    // make a call to retrieve the current network head
    api.rpc.chain.subscribeFinalizedHeads(async (header) => {
      console.log(`Parachain is at #${header.number}`)
      await onNewHeader(header) // TODO:
    })
  }

  submitNewCardanoHeader = async (header: CardanoHeader) => {
    this.pendingHeaders.push(header)
    const api = await this.api()
    if (this.txPending) {
      return
    }
    const headersToSubmit = [...this.pendingHeaders]
    this.pendingHeaders = []
    this.txPending = true
    const txs = headersToSubmit.map((h) => {
      return api.tx.ethereumLightClient.importHeader(h)
    })
    console.log(
      `Submitting ${headersToSubmit.length} txs with ids: ${headersToSubmit.map(
        (t) => `${t.number},`,
      )}`,
    )
    await api.tx.utility.batch(txs).signAndSend(this.account(), ({status}) => {
      if (status.isInBlock) {
        this.txPending = false
        console.log(`New Cardano headers included in ${status.asInBlock}`)
      }
    })
  }

  // async getWalletByName() {
  //   const alice = this.keyRing.addFromUri('//Alice', {name: 'Alice'})
  //   alice.
  //   console.log(alice.address)
  // }

  // async getSomething(address: string) {
  //   const wallet = this.keyRing.addFromAddress(address)
  //   console.log(wallet.toJson())
  // }
}
