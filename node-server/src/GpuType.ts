export type GpuType = '3060 Ti' | '3070' | '3080' | '3090' | 'RX 6800' | 'RX 6800 XT' | 'RX 6900 XT'

export function corralGpuType(gpuType: any): GpuType | null {
  switch (gpuType) {
    case '3060 Ti':
    case '3070':
    case '3080':
    case '3090':
    case 'RX 6800':
    case 'RX 6800 XT':
    case 'RX 6900 XT': {
      return <GpuType>gpuType
    }
    default: {
      return null
    }
  }
}