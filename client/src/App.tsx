import React from 'react';
import Navigation from './Navigation'
import Main from './Main'
import { NavLink } from 'react-router-dom'
import './App.css'
function App() {

  return (
    <div className='app'>
      <h1>
      <NavLink className='title' exact to='/'>Restock-Wizard</NavLink>
      </h1>
      <Navigation />
      <Main />
    </div>
  );
}

export default App;
