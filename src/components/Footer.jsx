import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/images/edu-logo.png'

const Footer = () => (
  <div className="footer">
    <div className="container">
      <h3 className="footer__title">Contact</h3>
      <p className="footer__email">edu-zone.support@edu-zone.org</p>
      <hr className="footer__line" />
      <Link to="/main">
        <img className="footer__logo" src={Logo} alt="Footer logo" />
      </Link>
      <p className="footer__copy">
        © {new Date().getFullYear()} All rights reserverd
      </p>
    </div>
  </div>
)

export default Footer
