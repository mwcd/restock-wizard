import React, { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

export default function Navigation() {

  return (
    <nav>
      <ul>
        <li><NavLink exact className='title' to='/'>Restock-Wizard</NavLink></li>
        <li><NavLink exact activeClassName="current" to='/3060Ti'>3060 Ti</NavLink></li>
        <li><NavLink exact activeClassName="current" to='/3070'>3070</NavLink></li>
        <li><NavLink exact activeClassName="current" to='/3080'>3080</NavLink></li>
        <li><NavLink exact activeClassName="current" to='/3090'>3090</NavLink></li>
        <li><NavLink exact activeClassName="current" to='/RX6800'>RX 6800</NavLink></li>
        <li><NavLink exact activeClassName="current" to='/RX6800XT'>RX 6800 XT</NavLink></li>
        <li><NavLink exact activeClassName="current" to='/RX6900XT'>RX 6900 XT</NavLink></li>
      </ul>
    </nav>
  );
}
