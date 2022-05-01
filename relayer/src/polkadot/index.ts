import '@polkadot/api-augment'
import {ApiPromise} from '@polkadot/api'
import {RawRelaychainHeader} from './types'

export class RelayChainConnection {
  private _api: ApiPromise | null = null

  private api = async (): Promise<ApiPromise> => {
    if (!this._api) {
      const a = await ApiPromise.create() // TODO: connect to you relay not to polkadot's launch
      this._api = a
      return a
    }
    return this._api
  }

  subToNewHeads = async (
    onNewHeader: (block: RawRelaychainHeader) => Promise<void>,
  ) => {
    const api = await this.api()
    // make a call to retrieve the current network head
    api.rpc.chain.subscribeFinalizedHeads(async (header) => {
      console.log(`Polkadot relay chain is at #${header.number}`)
      onNewHeader(header)
    })
  }
}
