import express from 'express'
import { poolDemo } from './db-sync'

// Create Express app
const app = express()

// A sample route
app.get('/', async (req, res) => {
    const x = await poolDemo()
    res.send(x)
})

// Start the Express server
app.listen(3002, () => console.log('Server running on port 3000!'))