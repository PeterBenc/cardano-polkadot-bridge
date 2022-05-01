export type RelaychainHeader = any

export type ParachainHeader = any

export type RawCardanoHeader = {
  id: number
  hash: Buffer
}

export type Utxo = {
  tx_hash: string
  tx_index: number
  receiver: string
  amount: string
  block_num: number
  txOutDbId: string
}
