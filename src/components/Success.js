import React from 'react';
import { withRouter } from 'react-router-dom';

function Success({ location }) {
  console.log(location)

  return (
    <p>Success!</p>
  )
}

export default withRouter(Success)