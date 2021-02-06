import express from 'express'
import { SingleGpuRecord } from '../interfaces/interfaces'
import { updateGpus } from './scrapeGpus'
import { corralGpuType } from './GpuType'
import { fetchGpus, fetchGpusOfType } from './database'

const app = express()
const port = process.env.PORT || 4000 // default port to listen
const REFRESH_SECONDS = 60 // how often to update scraped data

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methos', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.get('/gpus', (req, res) => {
    console.log('gpu request received')
    const gpuType = corralGpuType(req.query.gpuType)
    if (gpuType) {
        var data: SingleGpuRecord = {}
        data[gpuType] = fetchGpusOfType(gpuType)
        res.send(data)
    } else {
        res.send({ gpus: fetchGpus() })
    }
})

// start loop that scrapes new Gpu Updates.
// NOTE: our database update strategy relies on only one instance of 
// updateGpus() running at a time, as database updates are not atomic.
// Hence, the await on updateGpus(). 
async function refreshData() {
    console.log('UPDATING GPUS')
    const gpus = await updateGpus()
    console.log('GPUS UPDATED')
    setTimeout(refreshData, REFRESH_SECONDS * 1000)
}
refreshData()

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})

