import { useEffect, useState } from 'react'

const useModal = (initialValue) => {
  const [isOpen, setIsOpen] = useState(initialValue)

  useEffect(() => {
    const open = sessionStorage.getItem('new::user')
    if (!open) return

    setIsOpen(true)

    return () => setIsOpen(false)
  }, [])

  const closeModal = () => {
    setIsOpen(false)
    sessionStorage.removeItem('new::user')
  }

  return [isOpen, closeModal]
}

export default useModal
