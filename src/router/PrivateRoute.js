import { Redirect, Route } from "react-router-dom";

function ProtectedRoute({ children: Component, ...rest }) {
  const isAuth = localStorage.getItem('auth')

  return (
    <Route
      {...rest}
      render={({ location }) => (
        isAuth ? (
          <Component />
        ) : (
          <Redirect 
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      )}
    />
  )
}

export default ProtectedRoute