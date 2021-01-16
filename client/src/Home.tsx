import React, { useEffect, useState } from 'react'
import { GpuStock } from './Interfaces/interfaces'
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
          console.log("1")
          setGpus(result.data.gpus)
          console.log("2")
          setIsLoaded(true)
          console.log("3")
          console.log("result: " + result)
        },
        error => {
          setIsLoaded(true)
          setError(error)
          console.log("error: " + error)
        }
      )
  }, [])

  if (error.isError) {
    return <div>Error: {error.errorBody}</div>;
  } else if (!isLoaded) {
    return <Loading />;
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
  const data = React.useMemo(
    () => [
      {
        prodName: 'RTX 3060 Ti',
        avail: gpus.nvidia3060Ti[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidia3060Ti[0].price,
        link: gpus.nvidia3060Ti[0].address
      },
      {
        prodName: 'RTX 3070',
        avail: gpus.nvidia3070[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidia3070[0].price,
        link: gpus.nvidia3070[0].address
      },
      {
        prodName: 'RTX 3080',
        avail: gpus.nvidia3080[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidia3080[0].price,
        link: gpus.nvidia3080[0].address
      },
      {
        prodName: 'RTX 3090',
        avail: gpus.nvidia3090[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidia3090[0].price,
        link: gpus.nvidia3090[0].address
      },
      {
        prodName: 'RX 6800',
        avail: gpus.amdRx6800[0].inStock ? 'Available' : 'Not Available',
        price: gpus.amdRx6800[0].price,
        link: gpus.amdRx6800[0].address
      },
      {
        prodName: 'RX 6800 XT',
        avail: gpus.amdRx6800Xt[0].inStock ? 'Available' : 'Not Available',
        price: gpus.amdRx6800Xt[0].price,
        link: gpus.amdRx6800Xt[0].address
      },
      {
        prodName: 'RX 6900',
        avail: gpus.amdRx6900Xt[0].inStock ? 'Available' : 'Not Available',
        price: gpus.amdRx6900Xt[0].price,
        link: gpus.amdRx6900Xt[0].address
      },
    ],
    [gpus]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Product Name',
        accessor: 'prodName',
      },
      {
        Header: 'Availability',
        accessor: 'avail',
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Link',
        accessor: 'link',
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
    <table {...getTableProps()}>
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