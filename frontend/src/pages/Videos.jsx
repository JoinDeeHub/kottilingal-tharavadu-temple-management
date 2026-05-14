import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'
import CinematicText from '../components/CinematicText'

/**
 * Videos page.
 * - Pauses ambient audio (window.__templeAudio) when a video plays
 * - Resumes ambient audio when all videos are paused/ended
 * - Uses IntersectionObserver to auto-pause videos scrolled out of view
 */

const VIDEO_LIST = [
  { src: '/videos/temple-1.mp4', title: 'Temple Darshan', desc: 'Sacred glimpse of the Kottilingal Bhagavathi Temple' },
  { src: '/videos/temple-2.mp4', title: 'Festival Celebration', desc: 'Annual Uthsavam celebrations at the tharavadu' },
  { src: '/videos/temple-3.mp4', title: 'Daily Puja', desc: 'The sacred rhythm of daily offerings and prayers' },
]

function VideoCard({ src, title, desc, index, onPlay, onPauseEnd }) {
  const videoRef = useRef(null)
  const wrapRef  = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Auto-pause when scrolled out of view
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting && videoRef.current) videoRef.current.pause() },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handlePlay = () => {
    setPlaying(true)
    onPlay()
  }
  const handlePauseEnd = () => {
    setPlaying(false)
    onPauseEnd()
  }

  if (hasError) return null

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.16,1,0.3,1] }}
      style={{
        background: 'rgba(8,12,23,0.82)',
        border: `1px solid ${playing ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.14)'}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: playing
          ? '0 8px 48px rgba(139,0,0,0.35), 0 0 0 1px rgba(201,168,76,0.2)'
          : '0 4px 24px rgba(0,0,0,0.5)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16/9', background: '#080C17' }}>
        <video
          ref={videoRef}
          src={src}
          controls
          playsInline
          preload="metadata"
          onPlay={handlePlay}
          onPause={handlePauseEnd}
          onEnded={handlePauseEnd}
          onError={() => setHasError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Gold shimmer border when playing */}
        {playing && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            boxShadow: 'inset 0 0 30px rgba(201,168,76,0.08)',
          }} />
        )}
      </div>
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <h3 style={{ color: 'var(--gold)', fontFamily: 'Cinzel', letterSpacing: '0.08em', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
          {title.toUpperCase()}
        </h3>
        <p style={{ color: 'var(--ivory-dim)', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
      </div>
    </motion.div>
  )
}

export default function Videos() {
  const playingCount = useRef(0)

  const pauseAmbient = useCallback(() => {
    playingCount.current++
    const audio = window.__templeAudio
    if (audio && !audio.paused) audio.pause()
  }, [])

  const resumeAmbient = useCallback(() => {
    playingCount.current = Math.max(0, playingCount.current - 1)
    if (playingCount.current === 0) {
      const audio = window.__templeAudio
      if (audio && audio.paused) {
        audio.play().catch(() => {})
      }
    }
  }, [])

  return (
    <div className="bg-temple-gradient min-h-screen pt-24 pb-20 relative z-10">

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '3rem 1.5rem 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <p style={{ color: 'var(--gold-dim)', letterSpacing: '0.4em', fontSize: '0.7rem', fontFamily: 'Cinzel', marginBottom: '1rem' }}>TEMPLE IN MOTION</p>
          <CinematicText text="SACRED VIDEOS" tag="h1" color="var(--gold)" delay={100} />
          <p style={{ color: 'var(--ivory-dim)', marginTop: '1rem', maxWidth: '42ch', margin: '1rem auto 0', lineHeight: 1.8 }}>
            Live rituals, festival moments and sacred glimpses of the Kottilingal Bhagavathi Temple.
          </p>
        </motion.div>

        {/* Audio note */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            marginTop: '1.5rem', padding: '0.5rem 1.2rem',
            background: 'rgba(139,0,0,0.15)',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: 9999,
          }}
        >
          <span style={{ fontSize: '1rem' }}>🔇</span>
          <span style={{ color: 'var(--ivory-dim)', fontSize: '0.78rem', letterSpacing: '0.08em', fontFamily: 'Cinzel' }}>
            Background music pauses automatically while videos play
          </span>
        </motion.div>
      </section>

      <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg,transparent,var(--gold-dim),transparent)', margin: '1rem auto 3rem' }} />

      {/* Video grid */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '2rem' }}>
          {VIDEO_LIST.map((v, i) => (
            <VideoCard
              key={i}
              index={i}
              src={v.src}
              title={v.title}
              desc={v.desc}
              onPlay={pauseAmbient}
              onPauseEnd={resumeAmbient}
            />
          ))}
        </div>

        {/* Empty state if all error */}
        <ScrollReveal>
          <div style={{
            marginTop: '3rem', padding: '3rem 2rem', textAlign: 'center',
            border: '1px dashed rgba(201,168,76,0.15)', borderRadius: 14,
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
            <p style={{ color: 'var(--gold)', fontFamily: 'Cinzel', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>MORE VIDEOS COMING SOON</p>
            <p style={{ color: 'var(--ivory-dim)', fontSize: '0.9rem' }}>
              Upload your temple videos to <code style={{ color: 'var(--gold-dim)', fontSize: '0.85rem' }}>/frontend/public/videos/</code> to display them here.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
