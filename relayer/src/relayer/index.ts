import {CardanoConnection} from '../cardano'
import {
  ParachainBlock,
  RawCardanoBlock,
  RelaychainBlock,
} from '../cardano/types'
import {ParachainConnection} from '../parachain'
import {CardanoBlock, RawParachainBlock} from '../parachain/types'
import {RelayChainConnection} from '../polkadot'
import {RawRelaychainBlock} from '../polkadot/types'

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
    this.cardanoConnection.subToNewHeads(this.submitNewCardanoBlock)
    this.parachainConnection.subToNewHeads(this.submitNewParachainBlock)
    this.relaychainConnection.subToNewHeads(this.submitNewRelaychainBlock)
  }

  private submitNewCardanoBlock = async (block: RawCardanoBlock) => {
    const parsedBlock = block as CardanoBlock // TODO: real parsing
    await this.parachainConnection.submitNewCardanoBlock(parsedBlock)
  }

  private submitNewParachainBlock = async (block: RawParachainBlock) => {
    const parsedBlock = block as ParachainBlock // TODO: real parsing
    await this.cardanoConnection.submitNewParachainBlock(parsedBlock)
  }

  private submitNewRelaychainBlock = async (block: RawRelaychainBlock) => {
    const parsedBlock = block as RelaychainBlock // TODO: real parsing
    await this.cardanoConnection.submitNewParachainBlock(parsedBlock)
  }
}
