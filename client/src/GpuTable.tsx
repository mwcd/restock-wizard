import React from 'react'
import { GpuInfo } from './Interfaces/interfaces'
import { makeStyles } from '@material-ui/core/styles'
import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@material-ui/core'

interface props {
  gpus: GpuInfo[]
}

export default function GpuTable({ gpus }: props) {

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    noWrap: {
      whiteSpace: 'nowrap',
    }
  })
  const classes = useStyles()

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
          {gpus.map((gpu) => (
            <TableRow key={gpu.address}>
              <TableCell className={classes.noWrap} component='th' scope='row'>
                {gpu.gpuType}
              </TableCell>
              <TableCell align='right'>{gpu.name}</TableCell>
              <TableCell align='right'>{gpu.inStock ? 'available' : 'unavailable'}</TableCell>
              <TableCell align='right'>{gpu.price}</TableCell>
              <TableCell align='right'>
                <Typography>
                  <Link className={classes.noWrap} target="_blank" rel="noopener noreferrer" href={gpu.address}>View &rarr;</Link>
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}