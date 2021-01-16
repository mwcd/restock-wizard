import express from 'express'
import { updateGpus, getGpus } from './scrapeGpus'

const app = express()
const port = 8080 // default port to listen
const REFRESH_SECONDS=600 // how often to update scraped data

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methos', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    console.log("homepage request received")
    res.send( "Hello world!" )
})


// define a route handler for the default home page
app.get( "/gpus", ( req, res ) => {
    console.log("gpu request received")
    res.send({ gpus: getGpus() })
})

// start loop that scrapes new Gpu Updates
async function refreshData() {
    const gpus = await updateGpus()
    console.log("GPUS UPDATED")
    setTimeout(refreshData, REFRESH_SECONDS * 1000)
}
refreshData()

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` )
})

