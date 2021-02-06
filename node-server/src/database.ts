import dotenv from 'dotenv'
import { Client, QueryResult } from 'pg'
import { DataVersion, GpuInfo, GpuStock, GpuTableRecord } from '../interfaces/interfaces'
import { GpuType } from './GpuType'

let currGpus: GpuStock

/**
 * Inserts the set of gpus into their respective tables. This doesn't happen
 * atomically, but that shouldn't be an issue as dataVersion isn't incremented
 * until the very end, by which point the data is back in a cohesive state. \
 * This function should never be run in parallel
 * @param gpuStock The total set of gpus that should be inserted into the Database
 */
export async function insertGpus(gpuStock: GpuStock) {
  dotenv.config()
  const client = new Client() // all config done in environment
  client.connect()
  const dataVersion = await getDataVersion(client)
  const newDataVersion = dataVersion + 1
  insertGpusInTable(client, gpuStock, newDataVersion)
  updateDataVersion(client, newDataVersion)
  currGpus = gpuStock
}

/**
 * Fetch the most recent set of GPUs from the database table
 */
export function fetchGpus() {
  // If currGpus is null, we need to get most recent data from server. Otherwise we're
  // good to just take what's cached locally
  if (!currGpus) {
    // TODO: implement caching of some sort - should not fetch on each request
    dotenv.config()
    const client = new Client() // all config done in environment
    client.connect()
    getDataVersion(client).then(dataVersion => {
      fetchGpusFromTable(client, dataVersion).then(gpus => {
        currGpus = gpus
      })
    })
  }
  return currGpus
}

/**
 * Gets the list of a specific gpu type sold by vendors
 * @param gpuType The specific type of Gpus to return
 */
export function fetchGpusOfType(gpuType: GpuType): GpuInfo[] {
  console.log("fetching gpus of type: " + gpuType)
  const gpuStock = fetchGpus()
  switch (gpuType) {
      case '3060 Ti': {
          return gpuStock.nvidia3060Ti
      }
      case '3070': {
          return gpuStock.nvidia3070
      }
      case '3080': {
          return gpuStock.nvidia3080
      }
      case '3090': {
          return gpuStock.nvidia3090
      }
      case 'RX 6800': {
          return gpuStock.amdRx6800
      }
      case 'RX 6800 XT': {
          return gpuStock.amdRx6800Xt
      }
      case 'RX 6900 XT': {
          return gpuStock.amdRx6900Xt
      }
      default: {
          console.error("Error: Incorrect value recieved: " + gpuType)
          return []
      }
  }
}

async function getDataVersion(client: Client): Promise<number> {
  const query = 'SELECT * FROM  dataversion ORDER BY dataversion ASC LIMIT 1;'
  const res: QueryResult<DataVersion> = await client.query(query)
  const data = res.rows[0]
  return data.dataversion
}

//TODO: There is no opportunity for custom inputs, but we should still probably 
// sanitize to avoid sql injection
async function insertGpusInTable(client: Client, gpus: GpuStock, dataVersion: number) {
  let query = 'INSERT INTO gpus (name, gputype, address, price, instock, dataversion) VALUES '
  query = addGpusToQuery(query, gpus.amdRx6800, dataVersion)
  query = addGpusToQuery(query, gpus.amdRx6800Xt, dataVersion)
  query = addGpusToQuery(query, gpus.amdRx6900Xt, dataVersion)
  query = addGpusToQuery(query, gpus.nvidia3060Ti, dataVersion)
  query = addGpusToQuery(query, gpus.nvidia3070, dataVersion)
  query = addGpusToQuery(query, gpus.nvidia3080, dataVersion)
  query = addGpusToQuery(query, gpus.nvidia3090, dataVersion)

  // last row should end in ');', not '), '
  query = query.substring(0, query.length - 2) + ';'
  const res = await client.query(query)
}

async function updateDataVersion(client: Client, dataVersion: number) {
  dataVersion++
  // Only 1 row in table so no WHERE clause
  let query = 'UPDATE dataversion SET dataversion = ' + dataVersion
  const res = await client.query(query)
}

function addGpusToQuery(query: string, gpus: GpuInfo[], dataVersion: number): string {
  let queryArr: string[] = [query]

  gpus.forEach(gpu => {
    queryArr.push("('")
    queryArr.push(gpu.name)
    queryArr.push("', '")
    queryArr.push(gpu.gpuType)
    queryArr.push("', '")
    queryArr.push(gpu.address)
    queryArr.push("', ")
    queryArr.push(gpu.price ? gpu.price.substring(1) : "NULL") //Remove the leading $
    queryArr.push(", '" + gpu.inStock)
    queryArr.push("', '" + dataVersion)
    queryArr.push("'), ")
  })
  return queryArr.join("")

}

async function fetchGpusFromTable(client: Client, dataVersion: number) {
  let query = 'SELECT * FROM gpus WHERE dataversion=' + dataVersion
  // TODO: If we can get the cases to match, we can use duck typing to go straight
  // to a GpuStock[] here
  const result: QueryResult<GpuTableRecord> = await client.query(query)
  const gpuRecords = result.rows

  let gpuStock: GpuStock = {
    nvidia3060Ti: [],
    nvidia3070: [],
    nvidia3080: [],
    nvidia3090: [],
    amdRx6800: [],
    amdRx6800Xt: [],
    amdRx6900Xt: []
  }

  gpuRecords.forEach(gpuRecord => {
    let gpuInfo: GpuInfo = {
      name: gpuRecord.name,
      gpuType: gpuRecord.gputype,
      address: gpuRecord.address,
      price: gpuRecord.price,
      inStock: gpuRecord.instock
    }
    switch (gpuRecord.gputype) {
      case '3060 Ti':
        gpuStock.nvidia3060Ti.push(gpuInfo)
        break
      case '3070':
        gpuStock.nvidia3070.push(gpuInfo)
        break
      case '3080':
        gpuStock.nvidia3080.push(gpuInfo)
        break
      case '3090':
        gpuStock.nvidia3090.push(gpuInfo)
        break
      case 'RX 6800':
        gpuStock.amdRx6800.push(gpuInfo)
        break
      case 'RX 6800 XT':
        gpuStock.amdRx6800Xt.push(gpuInfo)
        break
      case 'RX 6900 XT':
        gpuStock.amdRx6900Xt.push(gpuInfo)
        break
    }
  })

  return gpuStock

}