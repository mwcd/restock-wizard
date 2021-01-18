import React, { useEffect, useState } from 'react'
import { GpuInfo, GpuStock } from './Interfaces/interfaces'
import { Cell, useTable } from 'react-table'
import axios from 'axios'

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
  let data: GpuInfo[]
  data = React.useMemo(
    () => {
      let homePageGpus: GpuInfo[] = []
      for (let key in gpus) {
        if (gpus.hasOwnProperty(key)) {
          homePageGpus.push((gpus as any)[key][0])
        }
      }
      return homePageGpus
    },
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