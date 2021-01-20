import React, { useEffect, useState } from 'react'
import { GpuStock } from './Interfaces/interfaces'
import axios from 'axios'
import GpuTable from './GpuTable'

export default function Home() {

  const emptyGpuStock: GpuStock = {
    nvidia3060Ti: [],
    nvidia3070: [],
    nvidia3080: [],
    nvidia3090: [],
    amdRx6800: [],
    amdRx6800Xt: [],
    amdRx6900Xt: []
  }

  const [error, setError] = useState({ isError: false, errorBody: null })
  const [isLoaded, setIsLoaded] = useState(false)
  const [gpus, setGpus] = useState(emptyGpuStock)


  useEffect(() => {
    axios.get('http://localhost:8080/gpus')
      .then(
        result => {
          setGpus(result.data.gpus)
          setIsLoaded(true)
        },
        error => {
          setIsLoaded(true)
          setError(error)
        }
      )
  }, [])

  if (error.isError) {
    return <div>Error: {error.errorBody}</div>;
  } else if (!isLoaded) {
    return (
      <Loading />
    );
  } else {
    const displayGpus = [
        gpus.nvidia3060Ti[0],
        gpus.nvidia3070[0],
        gpus.nvidia3080[0],
        gpus.nvidia3090[0],
        gpus.amdRx6800[0],
        gpus.amdRx6800Xt[0],
        gpus.amdRx6900Xt[0]
      ]

    return (
      <GpuTable gpus={displayGpus} />
    )
  }
}

function Loading() {
  return (
    <div>Loading...</div>
  )
}