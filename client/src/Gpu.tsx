import React, { useEffect, useState } from 'react'
import { GpuInfo, GpuType } from './Interfaces/interfaces'
import { Cell, useTable } from 'react-table'
import axios from 'axios'

interface props {
  gpuType: GpuType
}

export default function Gpu({ gpuType }: props) {
  const emptyGpuStock: GpuInfo[] = []

  const [error, setError] = useState({ isError: false, errorBody: null })
  const [isLoaded, setIsLoaded] = useState(false)
  const [gpus, setGpus] = useState(emptyGpuStock)


  useEffect(() => {
    axios.get('http://localhost:8080/gpus?gpuType=' + gpuType)
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

interface GpuTableProps {
  gpus: GpuInfo[]
}

function GpuTable({ gpus }: GpuTableProps) {
  let data: GpuInfo[]
  data = React.useMemo(
    () => gpus,
    [gpus]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: '',
        accessor: 'gpuType'
      },
      {
        Header: 'Product Name',
        accessor: 'name',
      },
      {
        Header: 'Availability',
        accessor: 'inStock',
        Cell: (cell: Cell) => cell.value ? 'Available' : 'Unavailable'
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Link',
        accessor: 'address',
        Cell: (cell: Cell) => <a target="_blank" rel="noopener noreferrer" href={cell.value}>
          View &rarr;</a>
      },
    ],
    []
  )
  // @ts-ignore
  const tableInstance = useTable({ columns, data })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance

  return (
    <table className='gpuTable' {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}