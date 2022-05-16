import {Header} from '@polkadot/types/interfaces'

export type RawRelaychainHeader = Header
export type RawParachainHeader = any

export type CardanoHeader = {
  number: number
  hash_: string
  parentHash: string
  transactionsRoot: string
}

export type ParachainEvent = {
  event: {section: unknown; method: unknown; data: {toString: () => unknown}[]}
}
