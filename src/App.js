import axios from 'axios'
import { useEffect, useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

/* Pages */
import Home from './views/Home'
import Account from './views/Account'
import Login from './views/Login'
import Register from './views/Register'
import Policy from './views/Policy'
import Terms from './views/Terms'

import PublicRoute from './routes/PublicRoute'
import PrivateRoute from './routes/PrivateRoute'
import { URL } from './constants'
import {
  getToken,
  initAxiosInterceptors,
  removeUserSession,
  setAccount,
  setUserLicense,
  setUserSession,
} from './utils/common'

initAxiosInterceptors()

function App() {
  const history = useHistory()
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const isPolicyPath = history.location.pathname === '/policy'
        
    const loadUser = async () => {
      if (isPolicyPath) {
        setAuthLoading(false)
        return
      }
      const token = getToken()
      if (!token) {
        return
      }

      try {
        const {
          data: { priceId, paymentMethodId, subscription, user, license },
        } = await axios.get(`${URL}/auth/me`)
        setAccount({ priceId, paymentMethodId, subscription })
        setUserSession(user)
        setUserLicense(license)
        setTimeout(() => isPolicyPath ? history.push('/policy') : history.push('/account'), 200)
        setAuthLoading(false)
      } catch (error) {
        removeUserSession()
        setAuthLoading(false)
      }
    }

    loadUser()

    setTimeout(function() {
      /* let viewheight = window.visualViewport.height // webkit browsers
      let viewwidth = window.visualViewport.width // webkit browsers */
      let viewheight = window.innerHeight
      let viewwidth = window.innerWidth
      let viewport = document.querySelector("meta[name=viewport]")
      viewport.setAttribute(
        "content",
        "height=" + viewheight + ", width=" + viewwidth + ", initial-scale=1.0"
      )
    }, 300)
    
  }, [history])

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/policy" component={Policy} />
      <Route path="/terms" component={Terms} />
      <PublicRoute path="/login" component={Login} />
      <PublicRoute path="/register" component={Register} />
      <PrivateRoute path="/account" component={Account} />
    </Switch>
  )
}

export default App
