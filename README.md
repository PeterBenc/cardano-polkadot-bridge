# cardano-polkadot-bridge

# Installation steps

1. Clone polkadot
2. Clone this repo
3. Setup polkadot-launcher
4. TODO

# Run steps

1. Run polkadot-launcher https://github.com/paritytech/polkadot-launch
2. Remove polkadot docker files so the node starts from 0
3. Run `cd docker` && `docker-compose up`

or

1. Run `cd polkadot && ./run_local_testnet.sh`
2. Run `cd docker && docker-compose up`

# Notes

if you kill the polkadot-launch, you need to remove the docker/polkadot data
in order for the polkadot node to start from 0, you should fix this somehow

for the node to be able to connect, you need to copy-paste the rococo-local-raw file to
polkadot/node-configs, you get this file by building the polkadot-launcher
