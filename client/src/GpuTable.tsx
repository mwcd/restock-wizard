import React from 'react'
import { GpuInfo } from './Interfaces/interfaces'
import { createStyles, Theme, makeStyles, withStyles } from '@material-ui/core/styles'
import { Link, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper, Container } from '@material-ui/core'


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
  },
}))


const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

export default function GpuTable({ gpus }: props) {
  const classes = useStyles()

  return (
    <Container fixed>
      <Paper className={classes.paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell colSpan={2}>Product Name</StyledTableCell>
              <StyledTableCell>Availability</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Link</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gpus.map((gpu) => (
              <StyledTableRow key={gpu.address}>
                <StyledTableCell component='th' scope='row'>
                  <Typography variant='body2' noWrap>{gpu.gpuType}</Typography>
                </StyledTableCell>
                <StyledTableCell align='right'>{gpu.name}</StyledTableCell>
                <StyledTableCell align='right'>{gpu.inStock ? 'available' : 'unavailable'}</StyledTableCell>
                <StyledTableCell align='right'>{gpu.price}</StyledTableCell>
                <StyledTableCell align='right'>
                  <Link noWrap color='textPrimary' target="_blank" rel="noopener noreferrer" href={gpu.address}>View &rarr;</Link>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}