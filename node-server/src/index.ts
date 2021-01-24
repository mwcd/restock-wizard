import express from 'express'
import { SingleGpuRecord } from '../interfaces/interfaces'
import { getGpus, getGpusOfType, updateGpus } from './scrapeGpus'
import { corralGpuType } from './GpuType'

const app = express()
const port = 8080 // default port to listen
const REFRESH_SECONDS = 60 // how often to update scraped data

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
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
        data[gpuType] = getGpusOfType(gpuType)
        res.send(data)
    } else {
        res.send({ gpus: getGpus() })
    }
})

// start loop that scrapes new Gpu Updates
async function refreshData() {
    const gpus = await updateGpus()
    console.log('GPUS UPDATED')
    setTimeout(refreshData, REFRESH_SECONDS * 1000)
}
refreshData()

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})

