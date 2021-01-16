import React from 'react'

interface props {
  stringVal: string
}

export default function Gpu({ stringVal }: props) {
  return (
    <div className='about'>
      <h1>About Me</h1>
      <p>STRINGVAL: {stringVal}</p>
    </div>
  )
}