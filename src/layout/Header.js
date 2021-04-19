import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getToken, removeUserSession } from '../utils/common'
import Logo from '@images/edu-logo.png'

const Header = () => {
  const history = useHistory()

  const handleLogout = () => {
    removeUserSession()
    history.push('/login')
  }

  return (
    <div className="header">
      <div className="container">
        <Link to="/" className="header__logo-container">
          <img className="header__logo" src={Logo} alt="Header logo" />
        </Link>
        <div className="header__button-group">
          {!getToken() && (
            <Link to="/register" className="button header__button-signup">
              Sign up
            </Link>
          )}
          <Link
            to="/login"
            className="button header__button-signin"
            onClick={getToken() ? handleLogout : null}
          >
            {getToken() ? 'Sign out' : 'Sign in'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Header
