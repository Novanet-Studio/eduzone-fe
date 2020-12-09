import React from 'react'

const PrevButton = ({ currentStep, onClick }) => {
  if (currentStep !== 1) {
    return (
      <button
        className="button button--secondary"
        type="button"
        onClick={onClick}
      >
        Previous
      </button>
    )
  }

  return null
}

export default PrevButton