import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('temple_token'))

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [token])

  const login = async (username, password) => {
    const form = new FormData()
    form.append('username', username)
    form.append('password', password)
    const res = await axios.post('/api/auth/token', form)
    const t = res.data.access_token
    setToken(t)
    localStorage.setItem('temple_token', t)
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
    setUser({ username })
    return t
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('temple_token')
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
