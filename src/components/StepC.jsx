import React from 'react'


const StepC = ({ currentStep, password, onChange }) => {
  if (currentStep !== 3) return null

  return (
    <div className="form__group">
      <label htmlFor="paymentMethod">Selecciona método de pago</label>
      <select name="paymentMethod" id="paymentMethod" onChange={onChange}>
        <option value="card">Tarjeta de crédito</option>
        <option value="debit-card">Tarjeta de débito</option>
        <option value="paypal">Paypal</option>
        <option value="zelle">Zelle</option>
      </select>
    </div>
  )
}

export default StepC
