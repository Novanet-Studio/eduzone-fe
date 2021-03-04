import { ErrorMessage as ErrorFormMessage } from '@hookform/error-message'
import './ErrorMessage.scss'
import SuccessIcon from '@images/SuccessIcon.svg'
import ErrorIcon from '@images/ErrorIcon.svg'

const ErrorMessage = ({ error }) => (
  <div className="error__head">
    <p className="error__text">{error}</p>
  </div>
)

export const ErrorMessageContainer = ({ children }) => (
  <div className="error__down">
    <p className="error__text">{children}</p>
  </div>
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

export const SuccessMessage = ({ errors = [], name = '', values = {} }) => {
  if (!values[name]) {
    return null
  }

  if (!errors[name]) {
    return (
      <div className="success">
        <img
          className="success__img"
          src={SuccessIcon}
          alt="Success Icon Eduzone"
        />{' '}
      </div>
    )
  }

  return (
    <div className="error">
      <img className="error__img" src={ErrorIcon} alt="Error Icon Eduzone" />{' '}
    </div>
  )
}

export default ErrorMessage
