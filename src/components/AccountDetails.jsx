import React from 'react'

const styles = {
  bold: {
    fontWeight: 'bold'
  },
  normal: {
    fontWeight: 'normal'
  }
}

const AccountDetails = ({
  firstname,
  lastname,
  email,
  status,
}) => (
  <div className="wrapper">
    <p style={styles.bold}>
      First Name:{' '}
      <span style={styles.normal}>
        {firstname}
      </span>
    </p>
    <p style={styles.bold}>
      Last Name:{' '}
      <span style={styles.normal}>
        {lastname || 'None'}
      </span>
    </p>
    <p style={styles.bold}>
      Email:{' '}
      <span style={styles.normal}>
        {email}
      </span>
    </p>
    <p style={styles.bold}>
      is active:{' '}
      <span style={styles.normal}>
        {status === 'ACT' ? 'active' : 'no active'}
      </span>
    </p>
  </div>
)

export default AccountDetails
