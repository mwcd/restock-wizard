export type GpuType = '3060 Ti' | '3070' | '3080' | '3090' | 'RX 6800' | 'RX 6800 XT' | 'RX 6900 XT'

export interface GpuInfo {
  name: string, 
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