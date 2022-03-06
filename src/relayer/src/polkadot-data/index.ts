import '@polkadot/api-augment'
import { ApiPromise } from '@polkadot/api';

// initialize via static create

export const subToNewHeads = async () => {
  const api = await ApiPromise.create()
    // make a call to retrieve the current network head
  api.rpc.chain.subscribeNewHeads((header) => {
    console.log(`Chain is at #${header.number}`);
  });
}
