import '@polkadot/api-augment'
import {ApiPromise} from '@polkadot/api'
import {ParachainClient} from './parachain'

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

  subToNewHeads = async () => {
    const api = await this.api()
    // make a call to retrieve the current network head
    api.rpc.chain.subscribeNewHeads((header) => {
      console.log(`Polkadot relay chain is at #${header.number}`)
    })
  }
}

const parachainEndpoint = 'ws://localhost:9966'

export const connectToParachain = async () => {
  const sub = new ParachainClient(parachainEndpoint)
  await sub.connect()
  await sub.getSomething('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
}
