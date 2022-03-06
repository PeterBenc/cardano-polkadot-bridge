import express from 'express'
import { poolDemo } from './cardano-data'
import { subToNewHeads } from './polkadot-data'

require("dotenv").config();

const SERVICE_PORT = process.env.RELAYER_SERVICE_PORT

// Create Express app
const app = express()

// A sample route
app.get('/', async (req, res) => {
    const x = await poolDemo()
    await subToNewHeads()
    // res.send(x)
})

// Start the Express server
app.listen(SERVICE_PORT, () => console.log(`Server running on port ${SERVICE_PORT}!`))