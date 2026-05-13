import { useEffect, useRef, Suspense, lazy, Component } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import DiyaRow from '../components/DiyaRow'
import EventsPreview from '../components/EventsPreview'
import ScrollParallax from '../components/ScrollParallax'
import CinematicText from '../components/CinematicText'
import ScrollReveal from '../components/ScrollReveal'

const IncenseSmoke = lazy(() => import('../components/IncenseSmoke'))

class ErrBound extends Component {
  state = { err: false }
  static getDerivedStateFromError() { return { err: false } }
  render() { return this.props.children }
}

// ── Scroll-driven horizontal marquee ──────────────────────────────
function Marquee({ items }) {
  return (
    <div style={{
      overflow: 'hidden', whiteSpace: 'nowrap',
      borderTop: '1px solid rgba(201,168,76,0.15)',
      borderBottom: '1px solid rgba(201,168,76,0.15)',
      padding: '0.6rem 0',
    }}>
      <motion.div
        style={{ display: 'inline-block' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ color: 'var(--gold-dim)', fontFamily: 'Cinzel', fontSize: '0.75rem', letterSpacing: '0.3em', marginRight: '3rem' }}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Depth layer card ───────────────────────────────────────────────
function DepthCard({ icon, title, desc, delay = 0, href }) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, boxShadow: '0 24px 60px rgba(139,0,0,0.35), 0 0 0 1px rgba(201,168,76,0.3)' }}
      style={{
        background: 'rgba(10,14,26,0.75)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(201,168,76,0.14)',
        borderRadius: 16,
        padding: '2rem',
        cursor: href ? 'pointer' : 'default',
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ color: 'var(--gold)', fontFamily: 'Cinzel', letterSpacing: '0.08em', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--ivory-dim)', fontSize: '0.95rem', lineHeight: 1.7 }}>{desc}</p>
    </motion.div>
  )
  return href ? <Link to={href}>{content}</Link> : content
}

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  // Scroll-driven hero transforms
  const heroOpacity   = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const heroScale     = useTransform(scrollYProgress, [0, 0.8], [1, 0.88])
  const heroBlur      = useTransform(scrollYProgress, [0, 0.6], [0, 12])
  const heroY         = useSpring(useTransform(scrollYProgress, [0, 1], [0, -120]), { stiffness: 80, damping: 20 })
  const bgY           = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const omScale       = useTransform(scrollYProgress, [0, 0.5], [1, 1.6])
  const omOpacity     = useTransform(scrollYProgress, [0, 0.5], [0.12, 0])

  return (
    <ErrBound>
    <div style={{ background: 'var(--navy)', minHeight: '100vh', position: 'relative' }}>

      {/* ── CINEMATIC HERO ────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: 'relative', minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Deep parallax BG layers */}
        <motion.div style={{ y: bgY, position: 'absolute', inset: 0, zIndex: 0 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse 70% 50% at 50% 30%, rgba(139,0,0,0.22) 0%, transparent 65%),
              radial-gradient(ellipse 100% 80% at 50% 100%, rgba(10,14,26,0.95) 0%, transparent 60%),
              linear-gradient(180deg, #0A0E1A 0%, #0D1322 40%, #111828 70%, #0A0E1A 100%)
            `,
          }} />
        </motion.div>

        {/* Giant OM watermark — deepest layer, scroll-driven scale */}
        <motion.div style={{
          position: 'absolute', zIndex: 1,
          scale: omScale, opacity: omOpacity,
          left: '50%', top: '48%',
          transform: 'translate(-50%,-50%)',
          userSelect: 'none', pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'Cinzel', fontSize: 'clamp(18rem, 40vw, 40rem)',
            color: 'rgba(201,168,76,0.07)',
            lineHeight: 1,
          }}>ॐ</span>
        </motion.div>

        {/* Incense sticks — left & right, scroll-reactive smoke */}
        <div style={{ position: 'absolute', bottom: '8%', left: '50%', marginLeft: '-210px', zIndex: 2 }}>
          <Suspense fallback={null}>
            <ErrBound><IncenseSmoke /></ErrBound>
          </Suspense>
        </div>
        <div style={{ position: 'absolute', bottom: '8%', left: '50%', marginLeft: '90px', zIndex: 2 }}>
          <Suspense fallback={null}>
            <ErrBound><IncenseSmoke flipped /></ErrBound>
          </Suspense>
        </div>

        {/* Main hero content — fades + scales out on scroll */}
        <motion.div
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY,
            filter: useTransform(heroBlur, v => `blur(${v}px)`),
            zIndex: 10,
            textAlign: 'center',
            padding: '0 1.5rem',
            position: 'relative',
          }}
        >
          {/* Pulsing temple circle */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 40px rgba(139,0,0,0.3), 0 0 80px rgba(201,168,76,0.1)',
                '0 0 80px rgba(139,0,0,0.6), 0 0 160px rgba(201,168,76,0.2)',
                '0 0 40px rgba(139,0,0,0.3), 0 0 80px rgba(201,168,76,0.1)',
              ]
            }}
            transition={{ duration: 3.5, repeat: Infinity }}
            style={{ borderRadius: '50%', display: 'inline-block', marginBottom: '2rem' }}
          >
            <div style={{
              width: 'clamp(140px, 20vw, 220px)', height: 'clamp(140px, 20vw, 220px)',
              borderRadius: '50%',
              border: '2px solid rgba(201,168,76,0.4)',
              background: 'radial-gradient(circle, rgba(139,0,0,0.3) 0%, rgba(10,14,26,0.8) 70%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              boxShadow: 'inset 0 0 40px rgba(201,168,76,0.08)',
            }}>
              🛕
            </div>
          </motion.div>

          {/* Title — cinematic char-by-char reveal */}
          <CinematicText
            text="KOTTILINGAL THARAVADU"
            tag="h1"
            className=""
            style={{ display: 'block' }}
            color="var(--gold)"
            delay={200}
          />
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            style={{
              fontFamily: 'Cinzel', fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
              background: 'linear-gradient(135deg, #C9A84C, #FFD700, #C9A84C)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '0.3em', marginTop: '0.3rem',
            }}
          >
            BHAGAVATHI TEMPLE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            style={{ color: 'rgba(245,237,214,0.5)', marginTop: '0.5rem', fontSize: '1rem', letterSpacing: '0.08em' }}
          >
            കോറ്റിലിങ്ങൽ തറവാട് ഭഗവതി ക്ഷേത്രം
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0 }}
            style={{ color: 'rgba(201,168,76,0.45)', fontSize: '0.78rem', letterSpacing: '0.2em', marginTop: '0.3rem' }}
          >
            📍 THRIKKADEERI · MUNNURCODE · CHERPPULASSERY · PALAKKAD
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2.5rem' }}
          >
            <Link to="/donate">
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(139,0,0,0.7)' }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: 'linear-gradient(135deg, #6B0F1A, #8B0000)',
                  border: '1px solid rgba(201,168,76,0.35)',
                  color: 'var(--gold)', fontFamily: 'Cinzel',
                  padding: '0.85rem 2.2rem', borderRadius: 9999,
                  letterSpacing: '0.12em', fontSize: '0.85rem',
                  boxShadow: '0 0 20px rgba(139,0,0,0.4)',
                  cursor: 'pointer',
                }}
              >🪔 MAKE AN OFFERING</motion.button>
            </Link>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.06, background: 'rgba(201,168,76,0.12)' }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(201,168,76,0.3)',
                  color: 'var(--gold)', fontFamily: 'Cinzel',
                  padding: '0.85rem 2.2rem', borderRadius: 9999,
                  letterSpacing: '0.12em', fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >DISCOVER THE TEMPLE</motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '0.4rem',
            }}
          >
            <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.65rem', letterSpacing: '0.3em', fontFamily: 'Cinzel' }}>SCROLL</span>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(var(--gold), transparent)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── MARQUEE ────────────────────────────────────────────── */}
      <Marquee items={['SREE BHAGAVATHI', 'KOTTILINGAL THARAVADU', 'EST. PALAKKAD KERALA', 'KERALA TANTRIC AGAMA', 'DAILY POOJAS', 'ANNUAL UTHSAVAM', 'VISHU KANI', 'NAVARATRI']} />

      {/* ── DEPTH SECTION — What we are ───────────────────────── */}
      <section style={{ padding: 'clamp(4rem,8vw,8rem) 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: 'var(--gold-dim)', letterSpacing: '0.4em', fontSize: '0.7rem', fontFamily: 'Cinzel', marginBottom: '1rem' }}>THE DIVINE PREMISE</p>
            <CinematicText
              text="A LIVING SACRED TRADITION"
              tag="h2"
              color="var(--ivory)"
              delay={0}
            />
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', margin: '1.5rem auto' }} />
            <p style={{ color: 'var(--ivory-dim)', maxWidth: '52ch', margin: '0 auto', lineHeight: 1.8, fontSize: '1.05rem' }}>
              For generations the Kottilingal family has maintained this sacred flame — a covenant with the Goddess Bhagavathi, renewed with each dawn through ritual, devotion, and community.
            </p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <DepthCard delay={0}    icon="🛕" title="PRESIDING DEITY"      desc="Sree Bhagavathi — Goddess of Power, Prosperity and Protection. The divine mother of the Kottilingal lineage." href="/about" />
          <DepthCard delay={0.1}  icon="🪔" title="DAILY RITUAL"         desc="Dawn to dusk — Usha Puja, Uchcha Puja, and Athazha Puja maintain the sacred rhythm of the temple every single day." />
          <DepthCard delay={0.2}  icon="🌺" title="KERALA AGAMA TRADITION" desc="The temple follows Kerala Tantric Agama — a living lineage of ritual knowledge passed through the tharavadu for over a century." />
          <DepthCard delay={0.3}  icon="🎊" title="ANNUAL UTHSAVAM"      desc="The grand annual festival unites all branches of the family — a time of devotion, celebration, and renewal of ancestral bonds." href="/events" />
          <DepthCard delay={0.4}  icon="🫂" title="FAMILY STEWARDSHIP"   desc="Managed collectively by all branches of the tharavadu — monthly contributions ensure the temple thrives for every future generation." />
          <DepthCard delay={0.5}  icon="✨" title="TRANSPARENT RECORDS"  desc="This digital platform preserves contributions, events, and family history with full transparency for every family member." href="/donate" />
        </div>
      </section>

      {/* ── FULL-BLEED QUOTE — David Whyte inspired ───────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(5rem,10vw,10rem) 1.5rem' }}>
        <ScrollParallax speed={0.15} direction="up" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,0,0,0.18) 0%, transparent 70%)',
          }} />
        </ScrollParallax>
        <ScrollReveal>
          <div style={{ textAlign: 'center', maxWidth: '38ch', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '4rem', color: 'rgba(201,168,76,0.2)', fontFamily: 'Cinzel', lineHeight: 1, marginBottom: '1rem' }}>&ldquo;</div>
            <blockquote style={{
              fontFamily: 'Cormorant Garamond', fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontStyle: 'italic', lineHeight: 1.65,
              color: 'var(--ivory)', letterSpacing: '0.02em',
            }}>
              Maintaining the sacred traditions passed down through the generations — preserving the divine legacy of Kottilingal Tharavadu for all those who are yet to come.
            </blockquote>
            <div style={{ width: 40, height: 1, background: 'var(--gold-dim)', margin: '2rem auto 1rem' }} />
            <p style={{ color: 'var(--gold-dim)', fontSize: '0.75rem', letterSpacing: '0.3em', fontFamily: 'Cinzel' }}>KOTTILINGAL THARAVADU</p>
          </div>
        </ScrollReveal>
      </section>

      {/* ── EVENTS PREVIEW ────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        <DiyaRow count={9} />
        <EventsPreview />
      </div>

      {/* ── GALLERY TEASER ────────────────────────────────────── */}
      <section style={{ padding: 'clamp(3rem,6vw,6rem) 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <ScrollReveal>
          <p style={{ color: 'var(--gold-dim)', letterSpacing: '0.4em', fontSize: '0.7rem', fontFamily: 'Cinzel', textAlign: 'center', marginBottom: '0.75rem' }}>THE TEMPLE IN MOMENTS</p>
          <CinematicText text="DIVINE GALLERY" tag="h2" color="var(--ivory)" />
        </ScrollReveal>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'auto auto',
          gap: '0.75rem', marginTop: '2.5rem',
        }}>
          {[1,2,3,4,5].map((i, idx) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              whileHover={{ scale: 1.03, zIndex: 2 }}
              style={{
                gridColumn: idx === 0 ? 'span 2' : 'span 1',
                aspectRatio: idx === 0 ? '2/1' : '1/1',
                background: 'rgba(10,14,26,0.8)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: 12, overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem',
                position: 'relative',
              }}
            >
              <img
                src={`/gallery/temple-${i}.jpg`}
                alt={`Temple ${i}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                loading="lazy"
                onError={e => { e.target.style.display = 'none' }}
              />
              🛕
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/gallery">
            <motion.button
              whileHover={{ letterSpacing: '0.35em', color: 'var(--gold-bright)' }}
              style={{
                background: 'none', border: '1px solid rgba(201,168,76,0.25)',
                color: 'var(--gold)', fontFamily: 'Cinzel',
                padding: '0.7rem 2rem', borderRadius: 9999,
                letterSpacing: '0.25em', fontSize: '0.75rem', cursor: 'pointer',
                transition: 'all 0.4s',
              }}
            >VIEW FULL GALLERY</motion.button>
          </Link>
        </div>
      </section>

    </div>
    </ErrBound>
  )
}
