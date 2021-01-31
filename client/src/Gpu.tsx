import React, { useEffect, useState } from 'react'
import { GpuInfo, GpuType } from './Interfaces/interfaces'
import axios from 'axios'
import GpuTable from './GpuTable'

interface props {
  gpuType: GpuType
}

export default function Gpu({ gpuType }: props) {
  const emptyGpuStock: GpuInfo[] = []

  const [error, setError] = useState({ isError: false, errorBody: null })
  const [isLoaded, setIsLoaded] = useState(false)
  const [gpus, setGpus] = useState(emptyGpuStock)


  useEffect(() => {
    axios.get('https://restock-wizard-api.herokuapp.com/gpus?gpuType=' + gpuType)
      .then(
        result => {
          setGpus(result.data[gpuType])
          setIsLoaded(true)
        },
        error => {
          setIsLoaded(true)
          setError(error)
        }
      )
  }, [gpuType])

  if (error.isError) {
    return <div>Error: {error.errorBody}</div>;
  } else if (!isLoaded) {
    return (
      <Loading />
    );
  } else {
    return (
      <GpuTable gpus={gpus} />
    );
  }
}

function Loading() {
  return (
    <div>Loading...</div>
  )
}