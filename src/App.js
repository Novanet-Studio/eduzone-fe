import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Main from './views/Main'
import Register from './views/Register'
import Login from './views/Login'
import Prices from './views/Prices'
import Account from './views/Account'
import Success from './components/Success'

import { GlobalProvider, useGlobal } from './context/globalContext';

import './App.scss'

const baseUrl = process.env.NODE_ENV === 'production' ? '/eduzonestore' : '/'

console.log(process.env.NODE_ENV)

const App = () => (
  <Router basename={baseUrl}>
    <Switch>
      <Route exact path="/">
        <Login />
      </Route>
      <Route exact path="/main">
        <Main />
      </Route>
      <Route exact path="/register">
        <Register />
      </Route>
      <Route exact path="/prices">
        <Prices />
      </Route>
      <Route exact path="/account">
        <Account />
      </Route>
      <Route exact path="/success">
        <Success />
      </Route>
    </Switch>
  </Router>
)

export default () => (
  <GlobalProvider>
    <App />
  </GlobalProvider>
)
