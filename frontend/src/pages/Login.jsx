import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.username, form.password)
      toast.success('🙏 Welcome, Admin!')
      navigate('/admin')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-temple-gradient min-h-screen flex items-center justify-center px-4">
      <motion.div className="glass-card p-10 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="text-center mb-8">
          <motion.span className="text-5xl block mb-4"
            animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>🪔</motion.span>
          <h1 className="shimmer-text text-2xl font-black tracking-widest" style={{ fontFamily: 'Cinzel' }}>ADMIN LOGIN</h1>
          <p className="text-amber-200/50 text-sm mt-1">Kottilingal Temple Management</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-amber-200/70 text-sm block mb-1">Username</label>
            <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} required
              className="w-full bg-[#1a0800] border border-yellow-900/40 text-amber-100 rounded-lg px-4 py-3 focus:border-yellow-500 outline-none"
              placeholder="admin" />
          </div>
          <div>
            <label className="text-amber-200/70 text-sm block mb-1">Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
              className="w-full bg-[#1a0800] border border-yellow-900/40 text-amber-100 rounded-lg px-4 py-3 focus:border-yellow-500 outline-none"
              placeholder="••••••••" />
          </div>
          <motion.button type="submit" disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-lg mt-2 disabled:opacity-60">
            {loading ? 'Authenticating...' : '🔐 Enter Admin Panel'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
