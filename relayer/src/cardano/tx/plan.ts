import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs'
import {Utxo} from '../types'

export const buildTx = (
  utxo: Utxo,
  privKeyHex: string,
  changeAddress: string,
  destAddress: string,
): Buffer => {
  const linearFee = CardanoWasm.LinearFee.new(
    CardanoWasm.BigNum.from_str('44'),
    CardanoWasm.BigNum.from_str('155381'),
  )

  const txBuilderCfg = CardanoWasm.TransactionBuilderConfigBuilder.new()
    .fee_algo(linearFee)
    .pool_deposit(CardanoWasm.BigNum.from_str('500000000'))
    .key_deposit(CardanoWasm.BigNum.from_str('2000000'))
    .max_value_size(4000)
    .max_tx_size(8000)
    .coins_per_utxo_word(CardanoWasm.BigNum.from_str('34482'))
    .build()

  const txBuilder = CardanoWasm.TransactionBuilder.new(txBuilderCfg)

  const prvKey = CardanoWasm.PrivateKey.from_normal_bytes(
    Buffer.from(privKeyHex, 'hex'), // TODO: make sure it works
  )

  const shelleyChangeAddress = CardanoWasm.Address.from_bech32(changeAddress)

  txBuilder.add_input(
    shelleyChangeAddress,
    CardanoWasm.TransactionInput.new(
      CardanoWasm.TransactionHash.from_bytes(Buffer.from(utxo.tx_hash, 'hex')), // tx hash
      utxo.tx_index, // index
    ),
    CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(utxo.amount)),
  )

  // base address
  const shelleyOutputAddress = CardanoWasm.Address.from_bech32(destAddress)

  // add output to the tx
  txBuilder.add_output(
    CardanoWasm.TransactionOutput.new(
      shelleyOutputAddress,
      CardanoWasm.Value.new(CardanoWasm.BigNum.from_str('1000000')),
    ),
  )

  txBuilder.add_change_if_needed(shelleyChangeAddress)

  // once the transaction is ready, we build it to get the tx body without witnesses
  const txBody = txBuilder.build()
  const txHash = CardanoWasm.hash_transaction(txBody)
  const witnesses = CardanoWasm.TransactionWitnessSet.new()

  // add keyhash witnesses
  const vkeyWitnesses = CardanoWasm.Vkeywitnesses.new()
  const vkeyWitness = CardanoWasm.make_vkey_witness(txHash, prvKey)
  vkeyWitnesses.add(vkeyWitness)
  witnesses.set_vkeys(vkeyWitnesses)

  // create the finalized transaction with witnesses
  const transaction = CardanoWasm.Transaction.new(
    txBody,
    witnesses,
    undefined, // transaction metadata
  )

  return Buffer.from(transaction.to_bytes())
}
