import React from 'react'
import { BrowserRouter as Switch, Route } from 'react-router-dom'

import Register from './views/Register'
import Login from './views/Login';
import Prices from './views/Prices'
import Account from './views/Account'
import Success from './components/Success';

const App = () => (
  <Switch>
    <Route exact path="/">
      <Login />
    </Route>
    <Route path="/register">
      <Register />
    </Route>
    <Route path="/prices">
      <Prices />
    </Route>
    <Route path="/account">
      <Account />
    </Route>
    <Route path="/success">
      <Success />
    </Route>
  </Switch>
)

export default App