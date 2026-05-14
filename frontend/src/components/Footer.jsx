import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Footer() {
  const diyas = Array(7).fill(null)
  return (
    <footer style={{ background: 'var(--navy)', borderTop: '1px solid rgba(201,168,76,0.12)', paddingTop: '3rem', paddingBottom: '2rem' }}>
      <div className="section-divider" />

      {/* Diya row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        {diyas.map((_, i) => (
          <motion.span key={i} style={{ fontSize: '1.8rem' }}
            animate={{ opacity: [1, 0.35, 1], scale: [1, 0.9, 1.05, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.18 }}
          >🪔</motion.span>
        ))}
      </div>

      {/* Links grid */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
        <div>
          <h3 style={{ color: 'var(--gold)', fontFamily: 'Cinzel', fontSize: '0.78rem', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>🛕 THE TEMPLE</h3>
          <p style={{ color: 'var(--ivory-dim)', fontSize: '0.85rem', lineHeight: 1.7 }}>Kottilingal Tharavadu<br/>Bhagavathi Temple</p>
          <p style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.78rem', marginTop: '0.4rem' }}>Thrikkadeeri, Palakkad</p>
          <p style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.78rem' }}>Kerala — 679502</p>
        </div>
        <div>
          <h3 style={{ color: 'var(--gold)', fontFamily: 'Cinzel', fontSize: '0.78rem', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>NAVIGATE</h3>
          {[['/', 'Home'], ['/about', 'About'], ['/events', 'Events'], ['/gallery', 'Gallery'], ['/videos', 'Videos'], ['/donate', 'Donate'], ['/contact', 'Contact']].map(([href, label]) => (
            <Link key={href} to={href} style={{ display: 'block', color: 'var(--ivory-dim)', fontSize: '0.83rem', padding: '0.2rem 0', transition: 'color 0.3s' }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'var(--ivory-dim)'}
            >{label}</Link>
          ))}
        </div>
        <div>
          <h3 style={{ color: 'var(--gold)', fontFamily: 'Cinzel', fontSize: '0.78rem', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>POOJA TIMINGS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {[['🌅', 'Usha Puja', '6:00 AM'], ['☀️', 'Uchcha Puja', '12:00 PM'], ['🌇', 'Evening Puja', '6:00 PM'], ['🕯️', 'Deeparadhana', '8:00 PM']].map(([icon, name, time]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ivory-dim)', fontSize: '0.82rem' }}>
                <span>{icon} {name}</span>
                <span style={{ color: 'var(--gold-dim)' }}>{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-divider" />

      {/* Copyright */}
      <div style={{ textAlign: 'center', padding: '1.2rem 1.5rem 0' }}>
        <p style={{ color: 'rgba(201,168,76,0.5)', fontSize: '0.78rem', letterSpacing: '0.06em', lineHeight: 2 }}>
          © 2026 Kottilingal Tharavadu Bhagavathi Temple · Built with devotion
          <span style={{ margin: '0 0.4rem' }}>🙏</span>
        </p>
        <p style={{ color: 'rgba(201,168,76,0.3)', fontSize: '0.72rem', letterSpacing: '0.08em', marginTop: '0.2rem' }}>
          <a
            href="https://github.com/JoinDeeHub"
            target="_blank" rel="noopener noreferrer"
            style={{ color: 'rgba(201,168,76,0.45)', textDecoration: 'none', transition: 'color 0.3s' }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'rgba(201,168,76,0.45)'}
          >JoinDeeHub</a>
          <span style={{ margin: '0 0.5rem', color: 'rgba(201,168,76,0.2)' }}>·</span>
          <span style={{ color: 'rgba(201,168,76,0.45)' }}>DEEPIKA NARENDRAN KOTTILINGAL</span>
          <span style={{ marginLeft: '0.4rem' }}>🙏</span>
        </p>
      </div>
    </footer>
  )
}
