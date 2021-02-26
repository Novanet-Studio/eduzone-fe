import { ErrorMessage as ErrorFormMessage } from '@hookform/error-message'
import './ErrorMessage.scss'

const ErrorMessage = ({ error }) => (
  <div className="error">
    <p className="error__text">{error}</p>
  </div>
)

export const ErrorMessageContainer = ({ children }) => (
  <span className="error">{children}</span>
)

export const ErrorSummary = ({ errors }) => {
  if (Object.keys(errors).length === 0) {
    return null
  }
  return (
    <div className="error-summary">
      {Object.keys(errors).map((fieldName) => (
        <ErrorFormMessage
          errors={errors}
          name={fieldName}
          as="div"
          key={fieldName}
        />
      ))}
    </div>
  )
}

export default ErrorMessage
