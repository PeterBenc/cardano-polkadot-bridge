import {exec} from 'child_process'

const withExportString = (cmd: string) =>
  `export CARDANO_NODE_SOCKET_PATH='/home/peter/Diploma/cp-bridge/cardano-polkadot-bridge/docker/cardano/node/node-ipc/node.socket' && ${cmd}`

export const submitTx = () => {
  exec(
    withExportString('cardano-cli get-tip --testnet-magic 1097911063'),
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      console.log(`${stdout}`)
    },
  )
}
