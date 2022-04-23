import express from 'express'
import {poolDemo} from './cardano'
import {connectToParachain, subToNewHeads} from './polkadot'

require('dotenv').config()

const SERVICE_PORT = process.env.RELAYER_SERVICE_PORT

// Create Express app
const app = express()

const runRelayerService = async () => {
  console.log(`Server running on port ${SERVICE_PORT}!`)
  console.log(await poolDemo())
  await subToNewHeads()
  await connectToParachain()
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
