import { getUser } from '../../utils/common'
import './AccountDetails.scss'

const AccountDetails = () => {
  const user = getUser()

  return (
    <div className="details">
      <p className="details__text">
        First Name:{' '}
        <span className="details__data">
          {user.firstname}
        </span>
      </p>
      <p className="details__text">
        Last Name:{' '}
        <span className="details__data">
          {user.lastname || 'None'}
        </span>
      </p>
      <p className="details__text">
        Email:{' '}
        <span className="details__data">
          {user.username}
        </span>
      </p>
      <p className="details__text">
        is active:{' '}
        <span className="details__data">
          {user.status === 'ACT' ? 'active' : 'no active'}
        </span>
      </p>
    </div>
  )
}

export default AccountDetails
