import '@polkadot/api-augment'
import {ApiPromise, WsProvider, Keyring} from '@polkadot/api'
import {CardanoHeader, RawParachainHeader} from './types'
import * as x from '@polkadot/api'
export class ParachainConnection {
  private _api: ApiPromise | null = null
  private provider: WsProvider
  private _account: ReturnType<x.Keyring['addFromUri']> | null = null

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
    // NOTE: this fn relies on cardano having a new block ~20 second, this should be batched
    const api = await this.api()
    const txHash = await api.tx.ethereumLightClient
      .importHeader(header)
      .signAndSend(this.account())
    console.log(`Submitted new Cardano header in ${txHash}`)
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
