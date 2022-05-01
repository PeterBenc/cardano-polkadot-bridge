import '@polkadot/api-augment'
import {ApiPromise, WsProvider, Keyring} from '@polkadot/api'
import {CardanoBlock, RawParachainBlock} from './types'
export class ParachainConnection {
  private _api: ApiPromise | null = null
  private keyRing: Keyring
  private provider: WsProvider

  constructor(wsEndpoint: string) {
    this.provider = new WsProvider(wsEndpoint)
    this.keyRing = new Keyring({type: 'sr25519'})
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

  subToNewHeads = async (
    onNewBlock: (block: RawParachainBlock) => Promise<void>,
  ) => {
    const api = await this.api()
    // make a call to retrieve the current network head
    api.rpc.chain.subscribeNewHeads(async (header) => {
      console.log(`Parachain is at #${header.number}`)
      await onNewBlock(null) // TODO:
    })
  }

  submitNewCardanoBlock = async (block: CardanoBlock) => {
    const api = await this.api()
    // api.tx.basicChannel.submit()
    console.log('Submitted new Cardano block', {block})
  }

  // async getWalletByName() {
  //   const alice = this.keyRing.addFromUri('//Alice', {name: 'Alice'})
  //   console.log(alice.address)
  // }

  // async getSomething(address: string) {
  //   const wallet = this.keyRing.addFromAddress(address)
  //   console.log(wallet.toJson())
  // }
}
