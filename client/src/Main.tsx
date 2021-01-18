import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Gpu from './Gpu'

export default function Main() {

  return (
    <Switch>
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/3060Ti' render={(props) => (
        <Gpu {...props} gpuType="3060 Ti" />
      )}></Route>
      <Route exact path='/3070' render={(props) => (
        <Gpu {...props} gpuType="3070" />
      )}></Route>
      <Route exact path='/3080' render={(props) => (
        <Gpu {...props} gpuType="3080" />
      )}></Route>
      <Route exact path='/3090' render={(props) => (
        <Gpu {...props} gpuType="3090" />
      )}></Route>
      <Route exact path='/RX6800' render={(props) => (
        <Gpu {...props} gpuType="RX 6800" />
      )}></Route>
      <Route exact path='/RX6800XT' render={(props) => (
        <Gpu {...props} gpuType="RX 6800 XT" />
      )}></Route>
      <Route exact path='/RX6900XT' render={(props) => (
        <Gpu {...props} gpuType="RX 6900 XT" />
      )}></Route>
    </Switch>
  )
}