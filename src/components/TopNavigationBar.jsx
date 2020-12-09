import React from 'react'

const styles = {
  topBar: {
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1200,
    marginRight: 'auto',
    marginLeft: 'auto',
  }
}

const TopNavigationBar = ({ loggedIn }) => (
  <div style={styles.topBar}>
    <div className="brand">Brand Here</div>
    <div className="wrapper">
      <button>{loggedIn ? 'Sign out' : 'Sign in'}</button>
    </div>
  </div>
)

export default TopNavigationBar
