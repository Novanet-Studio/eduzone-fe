import Main from '../views/Main'
import Login from '../views/Login'
import Register from '../views/Register'
import Prices from '../views/Prices'
import Account from '../views/Account'

const routes = [
  {
    path: '/',
    protected: false,
    exact: true,
    component: Main,
  },
  {
    path: '/login',
    protected: false,
    exact: true,
    component: Login,
  },
  {
    path: '/register',
    protected: false,
    exact: true,
    component: Register,
  },
  {
    path: '/prices',
    protected: false,
    exact: true,
    component: Prices,
  },
  {
    path: '/account',
    exact: true,
    protected: true,
    component: Account,
  }
]

export default routes
