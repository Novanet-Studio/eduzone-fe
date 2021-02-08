import { useState } from 'react'

const useError = (initialValue) => {
  const [error, setError] = useState(initialValue)

  const showError = (message) => setError(message)

  setTimeout(() => setError(null), 5000)

  return [error, showError]
}

export default useError
