import '@polkadot/api-augment'
import {ApiPromise, WsProvider, Keyring} from '@polkadot/api'
import {CardanoHeader, ParachainEvent, RawParachainHeader} from './types'
import * as x from '@polkadot/api'
import {application} from 'express'
import {ISubmittableResult} from '@polkadot/types/types'
import {SubmittableExtrinsic} from '@polkadot/api/types'
import {sleep} from '../utils'
export class ParachainConnection {
  private _api: ApiPromise | null = null
  private provider: WsProvider
  private _account: ReturnType<x.Keyring['addFromUri']> | null = null
  private pendingHeaders: CardanoHeader[] = []
  private txPending: boolean = false
  private blockHeaderSubmitting = false

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
    if (this.txPending || this.blockHeaderSubmitting) {
      return
    }
    const headersToSubmit = [...this.pendingHeaders]
    this.pendingHeaders = []
    this.txPending = true
    const txs = headersToSubmit.map((h) => {
      return api.tx.ethereumLightClient.importHeader(h)
    })
    await api.tx.utility.batch(txs).signAndSend(this.account(), ({status}) => {
      if (status.isInBlock) {
        this.txPending = false
        console.log(`New Cardano headers included in ${status.asInBlock}`)
      }
    })
  }

  mintAsset = async (address: string, amount: number) => {
    this.blockHeaderSubmitting = true
    const api = await this.api()
    if (this.txPending) {
      this.txPending = false
      sleep(10)
    }
    api.tx.ethApp
      .mint(
        '0x0000000000000000000000000000000000000000',
        address,
        amount,
        undefined,
      )
      .signAndSend(this.account(), ({status}) => {
        if (status.isInBlock) {
          this.blockHeaderSubmitting = false
          console.log(
            `${amount} PolkaADA token minted to ${address} in ${status.asInBlock}`,
          )
        }
      })
  }

  subToEvents = async (
    onNewEvent: (events: ParachainEvent[]) => Promise<void>,
  ) => {
    const api = await this.api()
    // make a call to retrieve the current network head
    api.query.system.events(async (events) => {
      await onNewEvent(events) // TODO:
    })
  }
}
