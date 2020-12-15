import Cookies from 'js-cookie'

// 从 cookies 中获取了Token
const TokenKey = 'vue_admin_template_token'
const SessionKey = 'old-back-sid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 可以获得原生的cookie，不一定是自己的cookie
export function getSession() {
  return Cookies.get(SessionKey)
}

export function setSession(sessionId) {
  return Cookies.set(SessionKey, sessionId)
}

export function removeSession() {
  return Cookies.remove(SessionKey)
}