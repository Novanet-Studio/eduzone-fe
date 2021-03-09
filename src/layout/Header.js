import { useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getToken, removeUserSession } from '../utils/common'
import Logo from '@images/edu-logo.png'

const Header = () => {
  const history = useHistory()
  const [login, setLogin] = useState(false)
  const changeLocation = () => setLogin(true)

  const handleLogout = () => {
    removeUserSession()
    history.push('/login')
  }

  if (login) {
    return <Redirect to="/login" />
  }

  return (
    <div className="header">
      <div className="container">
        <Link to="/" className="header__logo-container">
          <img className="header__logo" src={Logo} alt="Header logo" />
        </Link>
        <div className="header__button-group">
        <Link to="/register" className="button header__button-signup">       
            Sign up       
        </Link>
        <Link to="/" className="button header__button-signin" onClick={getToken() ? handleLogout : changeLocation}>       
            {getToken() ? 'Sign out' : 'Sign in'}       
        </Link>  
        </div>        
      </div>
    </div>
  )
}

export default Header
