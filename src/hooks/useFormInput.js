import { useState } from 'react'

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue)
  const [isTyping, setIsTyping] = useState(false)

  const handleChange = ({ currentTarget: target }) => {
    if (target.value === '') {
      setIsTyping(false)
      setValue('')
      return
    }
    setIsTyping(true)
    setValue(target.value)
  }

  const reset = () => {
    setIsTyping(false)
    setValue('')
  }

  return {
    value,
    isTyping,
    reset,
    onChange: handleChange,
  }
}

export default useFormInput
