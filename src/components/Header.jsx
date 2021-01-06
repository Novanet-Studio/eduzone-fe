import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/images/edu-logo.png'

const TopNavigationBar = ({ loggedIn, handleClick }) => (
  <div className="header">
    <div className="container">
      <img className="header__logo" src={Logo} alt="Header logo" />
      <Link  to="/">
        <button className="header__button" onClick={handleClick}>{loggedIn ? 'Sign out' : 'Sign in'}</button>
      </Link>
    </div>
  </div>
)

export default TopNavigationBar
