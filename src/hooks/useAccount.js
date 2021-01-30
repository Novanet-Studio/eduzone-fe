import { useContext } from 'react'
import { AccountContext } from '../context/accountContext'

export const useAccount = () => {
  const context = useContext(AccountContext)

  if (!context) {
    throw new Error('useAccount must be within AccountContext provider')
  }

  return context
}