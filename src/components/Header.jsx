import React from 'react'
import Logo from '../assets/images/edu-logo.png'

const TopNavigationBar = ({ loggedIn, handleClick }) => (
  <div className="header">
    <div className="container">
      <img className="header__logo" src={Logo} alt="Header logo" />
      <button className="header__login" onClick={handleClick}>
        {loggedIn ? 'Sign out' : 'Sign in'}
      </button>
    </div>
  </div>
)

export default TopNavigationBar
