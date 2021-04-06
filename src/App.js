import { useEffect } from 'react'
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
import {
  getToken,
  initAxiosInterceptors,
} from './utils/common'
import useLoadData from './hooks/useLoadData'

initAxiosInterceptors()

function App() {
  const history = useHistory()
  const authLoading = useLoadData(history)

  useEffect(() => {

    setTimeout(() => {
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
    
  }, [])

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
