import dotenv from 'dotenv'
import { Client } from 'pg'
import { DataVersion, GpuInfo, GpuStock } from '../interfaces/interfaces'

/**
 * Inserts the set of gpus into their respective tables. This doesn't happen
 * atomically, but that shouldn't be an issue as dataVersion isn't incremented
 * until the very end, by which point the data is back in a cohesive state. \
 * This function should never be run in parallel
 * @param gpuStock The total set of gpus that should be inserted into the Database
 */
export async function insertGpusInDb(gpuStock: GpuStock) {
  dotenv.config()
  console.log(process.env.PGUSER)
  const client = new Client() // all config done in environment
  client.connect()
  const dataVersion = await getDataVersion(client)
  insertGpusInTable(client, gpuStock.amdRx6800, "amdrx6800", dataVersion)
  insertGpusInTable(client, gpuStock.amdRx6800Xt, "amdrx6800xt", dataVersion)
  insertGpusInTable(client, gpuStock.amdRx6900Xt, "amdrx6900xt", dataVersion)
  insertGpusInTable(client, gpuStock.nvidia3060Ti, "nvidia3060ti", dataVersion)
  insertGpusInTable(client, gpuStock.nvidia3070, "nvidia3070", dataVersion)
  insertGpusInTable(client, gpuStock.nvidia3080, "nvidia3080", dataVersion)
  insertGpusInTable(client, gpuStock.nvidia3090, "nvidia3090", dataVersion)
  updateDataVersion(client)
}

async function getDataVersion(client: Client): Promise<number> {
  const query = "SELECT * FROM  dataversion ORDER BY dataversion ASC LIMIT 1;"
  const res = await client.query(query)
  const data: DataVersion = res.rows[0]
  console.log(data.dataversion)
  return data.dataversion
}

async function insertGpusInTable(client: Client, gpus: GpuInfo[], tableName: string, dataVersion: number) {
  const query = "INSERT INTO " + tableName
    + "(name, gputype, address, price, instock, dataversion"

}

async function updateDataVersion(client: Client) {

}