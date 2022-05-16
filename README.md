# Cardano-polkadot-bridge

# Prerequisities

- have `polkadot-lauch` setup
- `docker` and `docker-compose`
- `yarn` or `npm`
- `node`
- 5 gb of space (at least this much will be required for all cardano node and polkadot nodes data)
- building the the whole relayer service might take a significant amount of time (at least 10 hours) for all the nodes to sync
- `rust` set up (for building the parachain)

# Run steps

1. Clone and setup `polkadot-launch` https://github.com/paritytech/polkadot-launch
2. Clone this repository
3. Set the .env variables
4. `cd parachain`
5. `cargo build --release --features rococo-native` (this might take a long time)
6. `cd ../polkadot`
7. `./run_local_testnet.sh`
8. `cd ../docker`
9. `docker-compose up`
10. Wait a couple of minutes, all components should sync by then
11. `cd ../relayer`
12. `yarn dev`

# Swap tests

1. Have all components syncing and running
2. Navigate to `https://cloudflare-ipfs.com/ipns/dotapps.io/?rpc=ws%3A%2F%2F127.0.0.1%3A9966#/explorer` where you should be able to interact with the parachain which is running locally
3. Go to any cardano wallet, like `nu.fi` or `adalite.io` and send funds to the script address you provided in the `.env`
4. Once you send the funds the representative tokens will be minted on the parachain
5. In order to burn these tokens, use the `https://cloudflare-ipfs.com/ipns/dotapps.io/?rpc=ws%3A%2F%2F127.0.0.1%3A9966#/explorer`, navigate to extrinsics and select a `burn` transation
6. Once you burn the tokens look for a new transaction in your Cardano wallet which will unlock you the locked tokens
