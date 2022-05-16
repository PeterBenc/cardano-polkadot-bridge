import {CardanoConnection} from '../cardano'
import {
  ParachainHeader,
  RawCardanoHeader,
  RelaychainHeader,
  Utxo,
} from '../cardano/types'
import {ParachainConnection} from '../parachain'
import {ParachainEvent, RawParachainHeader} from '../parachain/types'
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
    // relay parachain events
    this.parachainConnection.subToEvents(this.relayParachainEvent)
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

  relayCardanoEvent = async (utxo: Utxo) => {
    // if (utxo.) // check if utxo is new header or lock
    console.log(utxo)
    await this.parachainConnection.mintAsset(
      '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', // TODO: get from utxo somehow
      Number(utxo.amount),
    )
  }

  relayParachainEvent = async (events: ParachainEvent[]) => {
    events.forEach((e) => {
      if (e.event.section === 'ethApp' && e.event.method === 'Burned') {
        const [address, , amount] = e.event.data.map((d) => d.toString())
        console.log(`${address} burned ${amount} PolkaADA`)
        this.cardanoConnection.unlockAsset()
      }
    })
  }
}
