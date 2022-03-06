# cardano-polkadot-bridge

# Run step

1. Run polkadot-launcher https://github.com/paritytech/polkadot-launch
2. Remove polkadot docker files so the node starts from 0
3. Run `cd docker` && `sudo docker-compose up`

# Notes

if you kill the polkadot-launch, you need to remove the docker/polkadot data
in order for the polkadot node to start from 0, you should fix this somehow

for the node to be able to connect, you need to copy-paste the rococo-local-raw file to 
polkadot/node-configs, you get this file by building the polkadot-launcher

