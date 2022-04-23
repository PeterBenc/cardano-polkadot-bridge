#!/bin/bash
echo "Removing old polkadot files"
rm -r ../docker/polkadot/.local

polkadot_local_testnet_config_path="./polkadot-launch-config.json"

# build spec for the parachain
../parachain/target/release/snowbridge build-spec --chain snowbase --disable-default-bootnode > spec.json

echo "Starting polkadot local network"
polkadot-launch $polkadot_local_testnet_config_path