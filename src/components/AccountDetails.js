import React from 'react'
import './AccountDetails.scss'

const AccountDetails = ({
  firstname,
  lastname,
  email,
  status,
}) => (
  <div className="details">
    <p className="details__text">
      First Name:{' '}
      <span className="details__data">
        {firstname}
      </span>
    </p>
    <p className="details__text">
      Last Name:{' '}
      <span className="details__data">
        {lastname || 'None'}
      </span>
    </p>
    <p className="details__text">
      Email:{' '}
      <span className="details__data">
        {email}
      </span>
    </p>
    <p className="details__text">
      is active:{' '}
      <span className="details__data">
        {status === 'ACT' ? 'active' : 'no active'}
      </span>
    </p>
  </div>
)

export default AccountDetails
