import { Redirect, Route } from "react-router-dom"
import { getToken } from "@utils/common"

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => !getToken() ? <Component {...props} /> : <Redirect to={{ pathname: '/account' }} />}
    />
  )
}

export default PublicRoute
