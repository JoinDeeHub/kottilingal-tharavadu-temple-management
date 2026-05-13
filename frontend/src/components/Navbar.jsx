import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/sponsors', label: 'Sponsors' },
  { to: '/donate', label: '🪔 Donate' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0d0500]/95 backdrop-blur-md shadow-lg shadow-yellow-900/20 py-2' : 'bg-transparent py-4'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl animate-flicker">🪔</span>
          <div>
            <div className="text-yellow-400 font-bold text-sm tracking-widest" style={{ fontFamily: 'Cinzel' }}>KOTTILINGAL THARAVADU</div>
            <div className="text-orange-400 text-xs tracking-wider">BHAGAVATHI TEMPLE</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`text-sm tracking-wider transition-all duration-300 hover:text-yellow-400 ${
                location.pathname === link.to ? 'text-yellow-400 border-b border-yellow-400' : 'text-amber-200'
              }`}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/admin" className="text-sm text-yellow-400 border border-yellow-600 px-3 py-1 rounded">Admin</Link>
              <button onClick={logout} className="text-sm text-red-400">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-sm text-yellow-400 border border-yellow-600 px-3 py-1 rounded hover:bg-yellow-600/20">Admin Login</Link>
          )}
        </div>

        <button className="lg:hidden text-yellow-400 text-2xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="lg:hidden bg-[#0d0500]/98 px-4 pb-4"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                className="block py-2 text-amber-200 hover:text-yellow-400 border-b border-yellow-900/30">
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
