import React from 'react'
import Logo from '../assets/images/edu-logo.png'

const Footer = () => (
  <div className="footer">
    <div className="container">
      <h3 className="footer__title">Contact</h3>
      <a href="mailto:edu-zone.support@edu-zone.org">
        <p className="footer__email">edu-zone.support@edu-zone.org</p>
      </a>
      <hr className="footer__line" />
      <a href="https://www.edu-zone.org/" target="_blank">
        <img className="footer__logo" src={Logo} alt="Footer logo" />
      </a>
      <p className="footer__copy">
        © {new Date().getFullYear()} All rights reserverd
      </p>
    </div>
  </div>
)

export default Footer
