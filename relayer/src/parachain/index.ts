import '@polkadot/api-augment'
import {ApiPromise, WsProvider, Keyring} from '@polkadot/api'

const parachainEndpoint = 'ws://localhost:9966'
export class ParachainConnection {
  private _api: ApiPromise | null = null
  private keyRing: Keyring
  private provider: WsProvider

  constructor() {
    this.provider = new WsProvider(parachainEndpoint)
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

  subToNewHeads = async () => {
    const api = await this.api()
    // make a call to retrieve the current network head
    api.rpc.chain.subscribeNewHeads((header) => {
      console.log(`Parachain is at #${header.number}`)
    })
  }

  async getWalletByName() {
    const alice = this.keyRing.addFromUri('//Alice', {name: 'Alice'})
    console.log(alice.address)
  }

  async getSomething(address: string) {
    const wallet = this.keyRing.addFromAddress(address)
    console.log(wallet.toJson())
  }

  // async queryAssetsAccountBalance(assetId, accountId) {
  //   let account = await this.api.query.assets.account(assetId, accountId);
  //   return BigNumber(account.balance.toBigInt())
  // }
}

// const parachainEndpoint = 'ws://localhost:9966'

// export const connectToParachain = async () => {
//   const sub = new ParachainClient(parachainEndpoint)
//   await sub.connect()
//   await sub.getSomething('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
// }
