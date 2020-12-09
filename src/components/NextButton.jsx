import React from 'react'

const NextButton = ({ currentStep, onClick }) => {
  if (currentStep < 3) {
    return (
      <button
        className="button button--primary button--float-right"
        type="button"
        onClick={onClick}
      >
        Next
      </button>
    )
  }

  return null
}

export default NextButton
