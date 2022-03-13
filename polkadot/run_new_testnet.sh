#!/bin/bash
echo "Removing old polkadot files"
rm -r ../docker/polkadot/.local

polkadot_local_testnet_config_path="./config.json"

echo "Starting polkadot local network"
polkadot-launch $polkadot_local_testnet_config_path