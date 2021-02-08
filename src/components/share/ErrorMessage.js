import './ErrorMessage.scss'

const ErrorMessage = ({ error }) => (
  <div className="error">
    <p className="error__text">{error}</p>
  </div>
)

export default ErrorMessage
