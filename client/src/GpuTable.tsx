import React from 'react'
import { GpuInfo } from './Interfaces/interfaces'
import { makeStyles } from '@material-ui/core/styles'
import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Container } from '@material-ui/core'

interface props {
  gpus: GpuInfo[]
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    width: "100%",
    marginBottom: theme.spacing(2),
    margin: "auto",
    minWidth: 650,
    maxWidth: 1200
  },
}))
export default function GpuTable({ gpus }: props) {
  const classes = useStyles()

  return (
    <Container fixed>
      <Paper className={classes.paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>Product Name</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gpus.map((gpu) => (
              <TableRow key={gpu.address}>
                <TableCell component='th' scope='row'>
                  <Typography variant='body2' noWrap>{gpu.gpuType}</Typography>
                </TableCell>
                <TableCell align='right'>{gpu.name}</TableCell>
                <TableCell align='right'>{gpu.inStock ? 'available' : 'unavailable'}</TableCell>
                <TableCell align='right'>{gpu.price}</TableCell>
                <TableCell align='right'>
                  <Link noWrap target="_blank" rel="noopener noreferrer" href={gpu.address}>View &rarr;</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}