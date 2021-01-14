import { useState } from 'react'

const useError = (initialState) => {
  const [error, setError] = useState(initialState)

  const showError = (message) => {
    setError(message)
    setTimeout(() => setError(null), 3000)
  }

  return { error, showError }
}

export default useError
