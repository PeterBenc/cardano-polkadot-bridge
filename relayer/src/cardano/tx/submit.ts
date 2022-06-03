import request from './request'

export const submitTx = async (tx: Buffer) => {
  const data = {
    signedTx: tx.toString('base64'),
  }
  const url = 'https://explorer-testnet.adalite.io/api/v2/txs/signed'
  return await request(url, 'POST', JSON.stringify(data), {
    'Content-Type': 'application/json',
  })
}
