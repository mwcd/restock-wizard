import React, { useEffect, useState } from 'react'
import { GpuInfo, GpuStock } from './Interfaces/interfaces'
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

  const apiUrl = process.env.REACT_APP_API_URL || 'https://restock-wizard-api.herokuapp.com'
  console.log(apiUrl)

  useEffect(() => {
    axios.get(apiUrl + '/gpus')
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
  }, [apiUrl])

  if (error.isError) {
    return <div>Error: {error.errorBody}</div>;
  } else if (!isLoaded) {
    return (
      <Loading />
    );
  } else {
    const displayGpus = filterDisplayGpus(gpus)

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

/**
 * Selects the first (cheapest) GPU of each type for display, as long as one exists.
 * One should always exist, except when the server has just been started and no data has
 * yet been fetched, but either way this prevents anything nasty like an NPE
 * @param gpus GpuStock from which to select gpus for front page display
 */
function filterDisplayGpus(gpus: GpuStock): GpuInfo[] {
  let displayGpus: GpuInfo[] = []

  if (gpus.nvidia3060Ti.length > 0) {
    displayGpus.push(gpus.nvidia3060Ti[0])
  }
  if (gpus.nvidia3070.length > 0) {
    displayGpus.push(gpus.nvidia3070[0])
  }
  if (gpus.nvidia3080.length > 0) {
    displayGpus.push(gpus.nvidia3080[0])
  }
  if (gpus.nvidia3090.length > 0) {
    displayGpus.push(gpus.nvidia3090[0])
  }
  if (gpus.amdRx6800.length > 0) {
    displayGpus.push(gpus.amdRx6800[0])
  }
  if (gpus.amdRx6800Xt.length > 0) {
    displayGpus.push(gpus.amdRx6800Xt[0])
  }
  if (gpus.amdRx6900Xt.length > 0) {
    displayGpus.push(gpus.amdRx6900Xt[0])
  }

  return displayGpus
}