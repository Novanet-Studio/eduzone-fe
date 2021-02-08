import axios from 'axios'
import { useEffect, useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import Home from './views/Home'
import Account from './views/Account'
import Login from './views/Login'
import Register from './views/Register'
import Prices from './views/Prices'
import PublicRoute from './routes/PublicRoute'
import PrivateRoute from './routes/PrivateRoute'
import { URL } from './constants'
import {
  getToken,
  initAxiosInterceptors,
  removeUserSession,
  setAccount,
  setUserSession,
} from './utils/common'

initAxiosInterceptors()

function App() {
  const history = useHistory()
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const token = getToken()
      if (!token) {
        return
      }

      try {
        const {
          data: { priceId, paymentMethodId, subscription, user },
        } = await axios.get(`${URL}/auth/me`)
        setAccount({ priceId, paymentMethodId, subscription })
        setUserSession(user)
        setTimeout(() => history.push('/account'), 200)
        setAuthLoading(false)
      } catch (error) {
        removeUserSession()
        setAuthLoading(false)
      }
    }

    loadUser()
  }, [history])

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <PublicRoute path="/login" component={Login} />
      <PublicRoute path="/register" component={Register} />
      <PublicRoute path="/prices" component={Prices} />
      <PrivateRoute path="/account" component={Account} />
    </Switch>
  )
}

export default App
