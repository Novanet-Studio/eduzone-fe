import React from 'react'
import { withRouter } from 'react-router-dom'
import './Success.scss'

function Success({ location }) {
  console.log(location)

  return (
    <section className="success">
      <div className="container">
        <div className="success__info">
          <h2 className="success__title">Success!</h2>
        </div>
      </div>
    </section>
  )
}

export default withRouter(Success)
