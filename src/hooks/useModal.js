import { useState } from 'react'

const useModal = (initialValue) => {
  const [isOpen, setIsOpen] = useState(initialValue)
  const closeModal = () => setIsOpen(false)

  return [isOpen, closeModal]
}

export default useModal
