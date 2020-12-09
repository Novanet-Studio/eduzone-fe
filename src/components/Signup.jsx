import React, { useState } from 'react'

import StepA from './StepA'
import StepB from './StepB'
import StepC from './StepC'

import PrevButton from './PrevButton'
import NextButton from './NextButton'

const defaultState = {
  currentStep: 1,
  email: '',
  password: '',
  subscription: '',
  paymentMethod: ''
}

const Signup = () => {
  const [state, setState] = useState(defaultState)

  // Steps
  const handleChange = (e) => {
    const {name, value} = e.target
    setState({ ...state, [name]: value })
  }

  // Form
  const handleSubmit = (e) => {
    e.preventDefault()
    const { email, password, subscription, paymentMethod } = state

    alert(`Your registration detail: \n
      Email: ${email} \n
      Password: ${password} \n
      Subscription Type: ${subscription} \n
      Payment Method: ${paymentMethod} \n `)
  }

  // Button actions
  const _next = () => {
    let currentStep = state.currentStep
    currentStep = currentStep >= 2 ? 3 : currentStep + 1
    setState({ ...state, currentStep })
  }

  const _prev = () => {
    let currentStep = state.currentStep
    currentStep = currentStep <= 1 ? 1 : currentStep - 1
    setState({ ...state, currentStep })
  }

  return (
    <>
      <h1>A Wizard Form!</h1>
      <p>Step {state.currentStep}</p>

      <form className="form" onSubmit={handleSubmit}>
        <StepA
          currentStep={state.currentStep}
          onChange={handleChange}
          email={state.email}
          password={state.password}
        />
        <StepB
          currentStep={state.currentStep}
          onChange={handleChange}
          username={state.username}
        />
        <StepC
          currentStep={state.currentStep}
          onChange={handleChange}
          username={state.username}
        />

        {state.currentStep !== 3 ? (
          <div>
            <PrevButton currentStep={state.currentStep} onClick={_prev} />
            <NextButton currentStep={state.currentStep} onClick={_next} />
          </div>
        ): (
          <button onSubmit={handleSubmit}>
            Submit info
          </button>
        )}
      </form>
    </>
  )
}

export default Signup