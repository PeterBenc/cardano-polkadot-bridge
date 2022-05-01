export const utxoQuery = `SELECT 
  TRIM(LEADING '\\x' from tx.hash::text) AS "tx_hash", tx_out.index AS "tx_index",
  tx_out.address AS "receiver", tx_out.value AS "amount", tx.block_id::INTEGER as "block_num",
  tx_out.id AS "txOutDbId"
FROM tx
INNER JOIN tx_out ON tx.id = tx_out.tx_id
WHERE NOT EXISTS (SELECT true
  FROM tx_in
  WHERE (tx_out.tx_id = tx_in.tx_out_id) AND (tx_out.index = tx_in.tx_out_index)
) AND (tx_out.address = ANY($1))`
