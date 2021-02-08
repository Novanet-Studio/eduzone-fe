import { Link } from 'react-router-dom'
import Logo from '../assets/images/edu-logo.png'

const Header = ({ loggedIn, onClick }) => {
  return (
    <div className="header">
      <div className="container">
        <Link to="/">
          <img className="header__logo" src={Logo} alt="Header logo" />
        </Link>
        <Link to="/">
          <button className="header__button" onClick={onClick} >
            {loggedIn ? 'Sign out' : 'Sign in'}
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Header
