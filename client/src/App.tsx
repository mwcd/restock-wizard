import React, { useState } from 'react';
// import Navigation from './Navigation'
// import Main from './Main'
import { makeStyles } from '@material-ui/core/styles'
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from 'react-router-dom'
import { Drawer, List, ListItem, ListItemText, Divider, Box } from '@material-ui/core';
import Home from './Home';
import Gpu from './Gpu';

const useStyles = makeStyles((theme) => ({
  active: {
    backgroudColor: theme.palette.action.selected
  },
  body: {
    display: 'flex',
  },
  drawerPaper: { width: 'inherit' },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary
  },
  list: {
    padding: 0,
  },
  title: {
    fontSize: theme.typography.h5.fontSize,
  },
  titleBox: {
    backgroundColor: theme.palette.primary.dark,
  }
}))

function App() {
  const [currTable, setCurrTable] = useState(useLocation().pathname)

  const classes = useStyles()
  return (
    <Router>
      <div className={classes.body}>
        <Drawer
          //TODO: How do I put this somewhere else?
          style={{ width: '220px' }}
          variant="persistent"
          anchor="left"
          open={true}
          classes={{ paper: classes.drawerPaper }}
        >
          <List className={classes.list}>
            <Box className={classes.titleBox}>
              <Link to='/' className={classes.link}>
                <ListItem button onClick={() => setCurrTable('/')}>
                  <ListItemText
                    classes={{ primary: classes.title }}
                    primary={'Restock Wizard'} />
                </ListItem>
              </Link>
            </Box>
            <Divider />
            <Link to='/3060Ti' className={classes.link}>
              <ListItem button onClick={() => setCurrTable('/3060Ti')} selected={currTable === '/3060Ti'}>
                <ListItemText primary={'3060 Ti'} />
              </ListItem>
            </Link>
            <Link to='/3070' className={classes.link}>
              <ListItem button onClick={() => setCurrTable('/3070')} selected={currTable === '/3070'}>
                <ListItemText primary={'3070'} />
              </ListItem>
            </Link>
            <Link to='/3080' className={classes.link}>
              <ListItem button onClick={() => setCurrTable('/3080')} selected={currTable === '/3080'}>
                <ListItemText primary={'3080'} />
              </ListItem>
            </Link>
            <Link to='/3090' className={classes.link}>
              <ListItem button onClick={() => setCurrTable('/3090')} selected={currTable === '/3090'}>
                <ListItemText primary={'3090'} />
              </ListItem>
            </Link>
            <Link to='/RX6800' className={classes.link}>
              <ListItem button onClick={() => setCurrTable('/RX6800')} selected={currTable === '/RX6800'}>
                <ListItemText primary={'RX 6800'} />
              </ListItem>
            </Link>
            <Link to='/RX6800XT' className={classes.link}>
              <ListItem button onClick={() => setCurrTable('/RX6800XT')} selected={currTable === '/RX6800XT'}>
                <ListItemText primary={'RX 6800 XT'} />
              </ListItem>
            </Link>
            <Link to='/RX6900XT' className={classes.link}>
              <ListItem button onClick={() => setCurrTable('/RX6900XT')} selected={currTable === '/RX6900XT'}>
                <ListItemText primary={'RX 6900 XT'} />
              </ListItem>
            </Link>
          </List>
        </Drawer>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route exact path='/3060Ti'>
            <Gpu gpuType='3060 Ti' />
          </Route>
          <Route exact path='/3070'>
            <Gpu gpuType='3070' />
          </Route>
          <Route exact path='/3080'>
            <Gpu gpuType='3080' />
          </Route>
          <Route exact path='/3090'>
            <Gpu gpuType='3090' />
          </Route>
          <Route exact path='/RX6800'>
            <Gpu gpuType='RX 6800' />
          </Route>
          <Route exact path='/RX6800XT'>
            <Gpu gpuType='RX 6800 XT' />
          </Route>
          <Route exact path='/RX6900XT'>
            <Gpu gpuType='RX 6900 XT' />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
