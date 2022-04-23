import '@polkadot/api-augment'
import {ApiPromise} from '@polkadot/api'
import {ParachainClient} from './parachain'

const parachainEndpoint = 'ws://localhost:9966'

// initialize via static create

export const subToNewHeads = async () => {
  const api = await ApiPromise.create()
  // make a call to retrieve the current network head
  api.rpc.chain.subscribeNewHeads((header) => {
    console.log(`Polkadot relay chain is at #${header.number}`)
  })
}

export const connectToParachain = async () => {
  const sub = new ParachainClient(parachainEndpoint)
  await sub.connect()
  await sub.getSomething('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
}
