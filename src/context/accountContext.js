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

  const updateAll = (data) => setAccountInformation(data)

  const value = useMemo(
    () => ({
      accountInformation,
      resetAccountInformation,
      updateAccountInformation,
      updateAll
    }),
    [accountInformation],
  )

  return <AccountContext.Provider value={value} {...props} />
}
