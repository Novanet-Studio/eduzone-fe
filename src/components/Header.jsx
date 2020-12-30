import React from 'react'

const TopNavigationBar = ({ loggedIn, handleClick }) => (
  <div className="header">
    <div className="container">
      <div className="header__logo">
          Header logo
      </div>
      <div className="header__login">
        <button onClick={handleClick}>{loggedIn ? 'Sign out' : 'Sign in'}</button>
      </div>
    </div>
  </div>
)

export default TopNavigationBar
