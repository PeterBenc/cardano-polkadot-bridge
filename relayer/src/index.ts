import express from 'express'
import {CardanoConnection} from './cardano'
import {ParachainConnection} from './parachain'
import {RelayChainConnection} from './polkadot'

require('dotenv').config()

const SERVICE_PORT = process.env.RELAYER_SERVICE_PORT

// Create Express app
const app = express()

// Create connections
const relaychainConnection = new RelayChainConnection()
const cardanoConnection = new CardanoConnection()
const parachainConnection = new ParachainConnection()

const runRelayerService = async () => {
  console.log(`Server running on port ${SERVICE_PORT}!`)
  relaychainConnection.subToNewHeads()
  cardanoConnection.subToNewHeads()
  parachainConnection.subToNewHeads()
  // await connectToParachain()
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
