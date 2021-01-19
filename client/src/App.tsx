import React from 'react';
import Navigation from './Navigation'
import Main from './Main'
import { NavLink } from 'react-router-dom'
import './App.css'
function App() {

  return (
    <div className='app'>
      <div className='body'>
        <Navigation />
        <Main />
      </div>
    </div>
  );
}

export default App;
