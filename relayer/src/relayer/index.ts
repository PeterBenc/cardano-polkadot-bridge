import {CardanoConnection} from '../cardano'
import {
  ParachainHeader,
  RawCardanoHeader,
  RelaychainHeader,
  Utxo,
} from '../cardano/types'
import {ParachainConnection} from '../parachain'
import {CardanoHeader, RawParachainHeader} from '../parachain/types'
import {RelayChainConnection} from '../polkadot'
import {RawRelaychainHeader} from '../polkadot/types'
import {parseRawCardanoHeader} from './utils'

export class Relayer {
  private parachainConnection: ParachainConnection
  private cardanoConnection: CardanoConnection
  private relaychainConnection: RelayChainConnection

  constructor(
    parachainConnection: ParachainConnection,
    cardanoConnection: CardanoConnection,
    relaychainConnection: RelayChainConnection,
  ) {
    this.parachainConnection = parachainConnection
    this.cardanoConnection = cardanoConnection
    this.relaychainConnection = relaychainConnection
  }

  run = async () => {
    // submit headers
    await this.parachainConnection.init()
    this.cardanoConnection.subToNewHeads(this.submitNewCardanoHeader)
    this.parachainConnection.subToNewHeads(this.submitNewParachainHeader)
    this.relaychainConnection.subToNewHeads(this.submitNewRelaychainHeader)

    // relay cardano events
    this.cardanoConnection.subToNewContractUtxos(this.relayCardanoEvent)
  }

  private submitNewCardanoHeader = async (header: RawCardanoHeader) => {
    const parsedHeader = parseRawCardanoHeader(header)
    await this.parachainConnection.submitNewCardanoHeader(parsedHeader)
  }

  private submitNewParachainHeader = async (header: RawParachainHeader) => {
    const parsedHeader = header as ParachainHeader // TODO: real parsing
    await this.cardanoConnection.submitNewParachainHeader(parsedHeader)
  }

  private submitNewRelaychainHeader = async (header: RawRelaychainHeader) => {
    const parsedHeader = header as RelaychainHeader // TODO: real parsing
    await this.cardanoConnection.submitNewParachainHeader(parsedHeader)
  }

  private relayCardanoEvent = async (utxo: Utxo) => {
    // we dont need to care about datum redeemer at all, sending means locking
    // well not realy, some of them might be polkadot headers so we need to check for that
    // so we always do "mint" call here

    // basically the same would happend for polkadot, subsribe to burn events, call this and unlock
    console.log(utxo)
  }
}
