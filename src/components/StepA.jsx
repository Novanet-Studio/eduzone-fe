import React from 'react'

const StepA = ({ currentStep, email, password, onChange }) => {
  if (currentStep !== 1)
    return null

  return (
    <div className="form__group">
      <label htmlFor="email">Email</label>
      <input
        className="form__input"
        id="email"
        name="email"
        type="text"
        placeholder="Enter email"
        value={email}
        onChange={onChange}
      />

      <label htmlFor="password">Contraseña</label>
      <input
        className="form__input"
        id="password"
        name="password"
        type="password"
        placeholder="Ingresa tu contraseña"
        value={password}
        onChange={onChange}
      />
    </div>
  )
}

export default StepA