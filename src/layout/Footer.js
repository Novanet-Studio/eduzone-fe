import Logo from '@images/edu-logo.png'
import PDF from "@images/Term_of_service_EDUZONE.pdf"

const Footer = () => (
  <div className="footer">
    <div className="container">
      <h2 className="footer__title">Contact</h2>
      <a href="mailto:edu-zone.support@edu-zone.org">
        <p className="footer__email">edu-zone.support@edu-zone.org</p>
      </a>
      <hr className="footer__line" />
      <a href="https://www.edu-zone.org/" target="_blank" rel="noreferrer">
        <img className="footer__logo" src={Logo} alt="Footer logo" />
      </a>
      <p className="footer__copy">
        © {new Date().getFullYear()} Edu-zone LLC. All rights reserved. 
      </p>
      <a className="footer__terms" href="/policy">Privacy Policy</a>
      <p className="footer__span">&nbsp;-&nbsp;</p>
      <a className="footer__terms" href={PDF} download> Terms and conditions </a>
    </div>
  </div>
)

export default Footer
