import React from 'react';
// import Navigation from './Navigation'
// import Main from './Main'
import './App.css'
import { makeStyles } from '@material-ui/core/styles'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Drawer, List, ListItem, ListItemText, Divider } from '@material-ui/core';
import Home from './Home';
import Gpu from './Gpu';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '1.6em',
  },
  drawerPaper: { width: 'inherit' },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary
  }
}))

function App() {
  const classes = useStyles()

  return (
    <Router>
      <div className='body'>
        <Drawer
          //TODO: How do I put this somewhere else?
          style={{ width: '220px' }}
          variant="persistent"
          anchor="left"
          open={true}
          classes={{ paper: classes.drawerPaper }}
        >
          <List>
            <Link to='/' className={classes.link}>
              <ListItem button>
                <ListItemText
                  classes={{ primary: classes.title }}
                  primary={'Restock Wizard'} />
              </ListItem>
            </Link>
            <Divider />
            <Link to='/3060Ti' className={classes.link}>
              <ListItem button>
                <ListItemText primary={'3060 Ti'} />
              </ListItem>
            </Link>
            <Link to='/3070' className={classes.link}>
              <ListItem button>
                <ListItemText primary={'3070'} />
              </ListItem>
            </Link>
            <Link to='/3080' className={classes.link}>
              <ListItem button>
                <ListItemText primary={'3080'} />
              </ListItem>
            </Link>
            <Link to='/3090' className={classes.link}>
              <ListItem button>
                <ListItemText primary={'3090'} />
              </ListItem>
            </Link>
            <Link to='/RX6800' className={classes.link}>
              <ListItem button>
                <ListItemText primary={'RX 6800'} />
              </ListItem>
            </Link>
            <Link to='/RX6800XT' className={classes.link}>
              <ListItem button>
                <ListItemText primary={'RX 6800 XT'} />
              </ListItem>
            </Link>
            <Link to='/RX6900XT' className={classes.link}>
              <ListItem button>
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
