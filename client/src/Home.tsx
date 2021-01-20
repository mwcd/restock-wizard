import React, { Fragment, useEffect, useState } from 'react'
import { GpuInfo, GpuStock } from './Interfaces/interfaces'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core'

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
    return (
      <HomeTable gpus={gpus} />
    );
  }
}

function Loading() {
  return (
    <div>Loading...</div>
  )
}

interface HomeTableProps {
  gpus: GpuStock
}

function HomeTable({ gpus }: HomeTableProps) {

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    noWrap: {
      whiteSpace: 'nowrap',
    }
  })
  const classes = useStyles()

  function formatData(gpus: GpuStock): GpuInfo[] {
    return [
      gpus.nvidia3060Ti[0],
      gpus.nvidia3070[0],
      gpus.nvidia3080[0],
      gpus.nvidia3090[0],
      gpus.amdRx6800[0],
      gpus.amdRx6800Xt[0],
      gpus.amdRx6900Xt[0]
    ]
  }
  const rows = formatData(gpus)


  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell></TableCell>
            <TableCell>Availability</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className={classes.noWrap} component='th' scope='row'>
                {row.gpuType}
              </TableCell>
              <TableCell align='right'>{row.name}</TableCell>
              <TableCell align='right'>{row.inStock ? 'available' : 'unavailable'}</TableCell>
              <TableCell align='right'>{row.price}</TableCell>
              <TableCell align='right'>
                <a className={classes.noWrap} target="_blank" rel="noopener noreferrer" href={row.address}>View &rarr;</a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}