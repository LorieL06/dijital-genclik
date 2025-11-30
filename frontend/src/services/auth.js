const TOKEN_KEY = 'account_security_token'
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}
export const getAuthHeaders = () => {
  const token = getToken()
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}
