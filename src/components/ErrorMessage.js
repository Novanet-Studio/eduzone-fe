import './ErrorMessage.scss'

const ErrorMessage = ({ errorMessage }) => (
  <div className="error">
    <p className="error__text">{errorMessage}</p>
  </div>
)

export default ErrorMessage
