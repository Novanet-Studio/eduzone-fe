import { useState } from 'react'

const useChangeLocation = (typing = false) => {
  const [isTyping, setIstyping] = useState(typing)

  const changeLocation = (location) => {
    location.state = { transition: true }

    return isTyping
      ? 'Are you sure you want to leave? Data will lost'
      : true
  }

  return [setIstyping, changeLocation]
}

export default useChangeLocation
