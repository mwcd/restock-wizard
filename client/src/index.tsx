import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'typeface-roboto'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core';
import { theme } from './Theme'
import './Index.css'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);