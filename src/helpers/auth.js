import axios from 'axios'

const TOKEN_KEY = 'EDUZONE_TOKEN'

class Auth {
  static setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  }

  static get getToken() {
    return localStorage.getItem(TOKEN_KEY)
  }

  static deleteToken() {
    localStorage.removeItem(TOKEN_KEY)
  }

  static initAxiosInterceptors() {
    axios.interceptors.request.use((config) => {
      const token = Auth.getToken

      if (token) {
        config.headers['x-access-token'] = token
      }

      return config
    })

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          throw new Error('Unauthorizated user')
        }
        return Promise.reject(error)
      },
    )
  }
}

export default Auth
