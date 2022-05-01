import {RawCardanoHeader} from '../cardano/types'
import {CardanoHeader} from '../parachain/types'

export const parseRawCardanoHeader = (
  rawHeader: RawCardanoHeader,
): CardanoHeader => {
  return {
    number: rawHeader.id,
    hash_: rawHeader.hash.toString('hex'),
    parentHash: rawHeader.hash.toString('hex'),
    transactionsRoot: rawHeader.hash.toString('hex'),
  }
}
