import '@polkadot/api-augment'
import { ApiPromise, WsProvider, Keyring} from '@polkadot/api';

export class ParachainClient {

  private _endpoint: string
  private _api: ApiPromise | null
  private _keyring: Keyring | null

  constructor(endpoint: string) {
    this._endpoint = endpoint;
    this._api = null;
    this._keyring = null;
  }

  private get api() {
    if (!this._api) {
      throw new Error('Api is null')
    }
    return this._api
  }

  private get keyRing() {
    if (!this._keyring) {
      throw new Error('Key ring is null')
    }
    return this._keyring
  }

  async connect() {
    const provider = new WsProvider(this._endpoint);
    this._api = await ApiPromise.create({
      provider,
    })
    this._keyring = new Keyring({ type: 'sr25519' })
  }

  async getWalletByName() {
    const alice = this.keyRing.addFromUri('//Alice', { name: 'Alice' })
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