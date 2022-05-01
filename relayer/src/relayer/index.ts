import {CardanoConnection} from '../cardano'
import {
  ParachainHeader,
  RawCardanoHeader,
  RelaychainHeader,
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
    await this.parachainConnection.init()
    this.cardanoConnection.subToNewHeads(this.submitNewCardanoHeader)
    this.parachainConnection.subToNewHeads(this.submitNewParachainHeader)
    this.relaychainConnection.subToNewHeads(this.submitNewRelaychainHeader)
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
}
