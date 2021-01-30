import { useState, createContext, useMemo } from 'react'

export const AccountContext = createContext()

const initialAccountInformation = {
  customer: '',
  customerId: '',
  paymentMethodId: '',
  priceId: '',
  subscription: '',
  user: '',
}

export const AccountProvider = (props) => {
  const [accountInformation, setAccountInformation] = useState(
    initialAccountInformation,
  )

  const resetAccountInformation = () =>
    setAccountInformation(initialAccountInformation)

  const updateAccountInformation = (name, value) =>
    setAccountInformation({ ...accountInformation, [name]: value })

  const value = useMemo(
    () => ({
      accountInformation,
      resetAccountInformation,
      updateAccountInformation
    }),
    [accountInformation],
  )

  return <AccountContext.Provider value={value} {...props} />
}
