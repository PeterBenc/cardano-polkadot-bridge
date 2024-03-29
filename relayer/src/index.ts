import express from 'express'
import {CardanoConnection} from './cardano'
import {Utxo} from './cardano/types'
import {ParachainConnection} from './parachain'
import {RelayChainConnection} from './polkadot'
import {Relayer} from './relayer'

require('dotenv').config()

const SERVICE_PORT = process.env.RELAYER_SERVICE_PORT

// Create Express app
const app = express()

// Create connections
const relaychainConnection = new RelayChainConnection()
const cardanoConnection = new CardanoConnection(
  process.env.CARDANO_SCRIPT_ADDRESS || '',
  process.env.RELAYER_CARDANO_ADDRESS || '',
)
const parachainConnection = new ParachainConnection(
  process.env.PARACHAIN_WS_ENDPOINT || '',
)

const runRelayerService = async () => {
  console.log(`Server running on port ${SERVICE_PORT}!`)
  const relayer = new Relayer(
    parachainConnection,
    cardanoConnection,
    relaychainConnection,
  )
  relayer.run()
}

// A sample route
// app.get('/', async (req, res) => {
//     console.log(await poolDemo())
//     await subToNewHeads()
//     await connectToParachain()
//     // res.send(x)
// })

// Start the Express server
app.listen(SERVICE_PORT, async () => await runRelayerService())
