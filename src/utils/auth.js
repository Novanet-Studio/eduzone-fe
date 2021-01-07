const TOKEN_KEY = 'EDUZONE_KEY'

export default class Auth {
  static setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  }

  static get getToken() {
    return localStorage.getItem(TOKEN_KEY)
  }

  static deleteToken() {
    localStorage.removeItem(TOKEN_KEY)
  }
}
