import React from 'react'

const styles = { padding: '.5rem', textAlign: 'center' }

const Footer = () => (
  <div style={styles}>
    <p>All rights reserver - {new Date().getFullYear()}</p>
  </div>
)

export default Footer