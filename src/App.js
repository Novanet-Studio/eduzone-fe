import { Switch, Route, useHistory } from 'react-router-dom'

import { ProtectedRoute, routes } from './router'

import Auth from './helpers/auth'
import { GlobalProvider } from './context/globalContext'
import { AccountProvider } from './context/accountContext'
import useAuth from './hooks/useAuth'

console.log(process.env.NODE_ENV)

Auth.initAxiosInterceptors()

const App = () => {
  const history = useHistory()
  const auth = useAuth()

  if (auth.user) {
    // Wait 500ms to enter in account, prevent error.
    setTimeout(() => {
      history.push('/account', { accountInformation: auth })
    }, 500)
  }

  return (
    <Switch>
      {routes.map((route, index) =>
        !route.protected ? (
          <Route
            key={index}
            exact={route.exact}
            path={route.path}
            component={route.component}
          />
        ) : (
          <ProtectedRoute
            key={index}
            exact={route.exact}
            path={route.path}
            children={route.component}
          />
        ),
      )}
    </Switch>
  )
}

//eslint-disable-next-line
export default () => (
  <GlobalProvider>
    <AccountProvider>
      <App />
    </AccountProvider>
  </GlobalProvider>
)
