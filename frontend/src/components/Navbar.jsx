import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/videos', label: 'Videos' },
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
        scrolled
          ? 'backdrop-blur-md shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
      style={scrolled ? { background: 'rgba(8,12,23,0.96)', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' } : {}}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo — temple1.jpg */}
        <Link to="/" className="flex items-center gap-3">
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '1px solid rgba(201,168,76,0.4)',
            overflow: 'hidden', flexShrink: 0,
            boxShadow: '0 0 12px rgba(139,0,0,0.4)',
          }}>
            <img
              src="/temple1.jpg"
              alt="Temple Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '🛕' }}
            />
          </div>
          <div>
            <div style={{ color: 'var(--gold)', fontFamily: 'Cinzel', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em' }}>KOTTILINGAL THARAVADU</div>
            <div style={{ color: 'var(--crimson)', fontSize: '0.65rem', letterSpacing: '0.12em' }}>BHAGAVATHI TEMPLE</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-5">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              style={{
                fontSize: '0.78rem', letterSpacing: '0.1em', fontFamily: 'Cinzel',
                color: location.pathname === link.to ? 'var(--gold)' : 'var(--ivory-dim)',
                borderBottom: location.pathname === link.to ? '1px solid var(--gold)' : 'none',
                paddingBottom: 2, transition: 'color 0.3s',
              }}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/admin" style={{ color: 'var(--gold)', fontSize: '0.78rem', border: '1px solid var(--gold-dim)', padding: '2px 10px', borderRadius: 4 }}>Admin</Link>
              <button onClick={logout} style={{ color: '#ef4444', fontSize: '0.78rem' }}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'var(--gold)', fontSize: '0.78rem', border: '1px solid var(--gold-dim)', padding: '2px 10px', borderRadius: 4 }}>Admin Login</Link>
          )}
        </div>

        <button
          className="lg:hidden text-2xl"
          style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >☰</button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            style={{ background: 'rgba(8,12,23,0.98)', padding: '0.5rem 1rem 1rem' }}
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
          >
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block', padding: '0.6rem 0',
                  color: 'var(--ivory-dim)', borderBottom: '1px solid rgba(201,168,76,0.1)',
                  fontFamily: 'Cinzel', fontSize: '0.85rem', letterSpacing: '0.08em',
                }}
              >{link.label}</Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
