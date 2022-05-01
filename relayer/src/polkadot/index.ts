import '@polkadot/api-augment'
import {ApiPromise} from '@polkadot/api'
import {RawRelaychainBlock} from './types'

export class RelayChainConnection {
  private _api: ApiPromise | null = null

  private api = async (): Promise<ApiPromise> => {
    if (!this._api) {
      const a = await ApiPromise.create()
      this._api = a
      return a
    }
    return this._api
  }

  subToNewHeads = async (
    onNewBlock: (block: RawRelaychainBlock) => Promise<void>,
  ) => {
    const api = await this.api()
    // make a call to retrieve the current network head
    api.rpc.chain.subscribeNewHeads((header) => {
      console.log(`Polkadot relay chain is at #${header.number}`)
      onNewBlock(null) // TODO:
    })
  }
}
