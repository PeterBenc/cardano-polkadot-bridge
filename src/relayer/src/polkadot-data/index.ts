import { ApiPromise } from '@polkadot/api';

// initialise via static create
ApiPromise.create().then((api) => {
  // make a call to retrieve the current network head
  api.rpc.chain.subscribeNewHeads((header) => {
    console.log(`Chain is at #${header.number}`);
  });
})