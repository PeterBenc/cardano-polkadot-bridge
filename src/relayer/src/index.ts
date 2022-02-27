import express from 'express'
import { poolDemo } from './cardano-data'

// Create Express app
const app = express()

// A sample route
app.get('/', async (req, res) => {
    const x = await poolDemo()
    res.send(x)
})

// Start the Express server
app.listen(process.env.RELAYER_SERVICE_PORT || 3000, () => console.log('Server running on port 3000!'))