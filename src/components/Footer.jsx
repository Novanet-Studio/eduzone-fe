import React from 'react'

const Footer = () => (
  <div className="footer">
    <div className="container">
      <h3 className="footer__title">Contact</h3>
      <p className="footer__email">edu-zone.support@edu-zone.org</p>
      <div className="footer__logo">
        footer logo
      </div>
      <hr className="footer__line" />
      <p className="footer__copy">© {new Date().getFullYear()} All rights reserverd</p>
    </div>
  </div>
)

export default Footer