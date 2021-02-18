import axios from 'axios'

export const getUser = () => {
  const user = sessionStorage.getItem('eduzone::user')
  if (!user) return null

  return JSON.parse(user)
}

export const getToken = () => {
  return localStorage.getItem('eduzone::token') || null
}

export const getUserCredentials = () => {
  const email = sessionStorage.getItem('eduzone::email')
  const password = sessionStorage.getItem('eduzone::password')

  if (!email || !password) return null

  return { email, password }
}

export const getUserAccount = () => {
  const account = sessionStorage.getItem('eduzone::account')
  if (!account) return null
  if (!Object.keys(JSON.parse(account)).length) {
    return {
      paymentMethodId: '',
      priceId: '',
      subscription: {
        id: '',
      },
    }
  }

  return JSON.parse(account)
}

export const getUserLicense = () => {
  const license = sessionStorage.getItem('eduzone::license')
  if (!license) return null
  if (!Object.keys(JSON.parse(license)).length) {
    return {
      type: null,
      accesscode: null,
    }
  }

  return JSON.parse(license)
};


export const setToken = (token) => {
  localStorage.setItem('eduzone::token', token)
}

export const removeUserSession = () => {
  localStorage.removeItem('eduzone::token')
  sessionStorage.removeItem('eduzone::user')
  sessionStorage.removeItem('eduzone::account')
  sessionStorage.removeItem('paymentMethodId')
  sessionStorage.removeItem('eduzone::license')
  sessionStorage.removeItem('eduzone::product')
  sessionStorage.removeItem('email')
}

export const setUserSession = (user) => {
  sessionStorage.setItem('eduzone::user', JSON.stringify(user))
}

export const setUserLicense = (license) => {
  sessionStorage.setItem('eduzone::license', JSON.stringify(license));
}

export const setAccount = (account) => {
  sessionStorage.setItem('eduzone::account', JSON.stringify(account))
}

export const setUserCredentials = (email, password) => {
  sessionStorage.setItem('eduzone::email', email)
  sessionStorage.setItem('eduzone::password', password)
}

export const removeUserCredentials = () => {
  sessionStorage.removeItem('eduzone::email')
  sessionStorage.removeItem('eduzone::password')
}

export const initAxiosInterceptors = () => {
  axios.interceptors.request.use((config) => {
    const token = getToken()

    if (token) {
      config.headers['x-access-token'] = token
    }

    return config
  })

  axios.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  )
}
