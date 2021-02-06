import { GpuType } from '../src/GpuType'

export interface GpuInfo {
  name: string
  gpuType: GpuType
  address: string
  price: string
  inStock: boolean
}

export interface GpuStock {
  nvidia3060Ti: GpuInfo[],
  nvidia3070: GpuInfo[],
  nvidia3080: GpuInfo[],
  nvidia3090: GpuInfo[],
  amdRx6800: GpuInfo[],
  amdRx6800Xt: GpuInfo[],
  amdRx6900Xt: GpuInfo[],
}

export interface SingleGpuRecord {
  [key: string]: GpuInfo[]
}

export interface DataVersion {
  dataversion: number
}

export interface GpuTableRecord {
  name: string
  gputype: GpuType
  address: string
  price: string //Should this be number?
  instock: boolean
  dataversion: number
}