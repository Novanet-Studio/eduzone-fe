import React from 'react'

const StepB = ({ currentStep, username, onChange }) => {
  if (currentStep !== 2) return null

  return (
    <div className="form__group">
      <label htmlFor="username">Elije el tipo de subscripcion</label>
      <div>
        <label>
          Basico
          <input
            type="radio"
            name="subscription"
            value="basic"
            id="1"
            onChange={onChange}
          />
        </label>
        <label>
          Full
          <input
            type="radio"
            name="subscription"
            value="full"
            id="2"
            onChange={onChange}
          />
        </label>
        <label>
          Premium
          <input
            type="radio"
            name="subscription"
            value="premium"
            id="3"
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  )
}

export default StepB
