import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Main from './views/Main'
import Register from './views/Register'
import Login from './views/Login'
import Prices from './views/Prices'
import Account from './views/Account'
import Success from './components/Success'
import Example from './Example'

import { GlobalProvider } from './context/globalContext';

export const baseUrl = process.env.NODE_ENV === 'production' ? '/eduzonestore' : '/'

console.log(process.env.NODE_ENV)

const App = () => (
  <Router basename={baseUrl}>
    <Switch>
      <Route exact path="/">
        <Main />
      </Route>
      <Route exact path="/login">
        <Login />
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
      <Route exact path="/example">
        <Example />
      </Route>
    </Switch>
  </Router>
)

//eslint-disable-next-line
export default () => (
  <GlobalProvider>
    <App />
  </GlobalProvider>
)
