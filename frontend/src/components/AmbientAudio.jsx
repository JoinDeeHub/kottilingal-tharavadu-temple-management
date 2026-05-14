import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Ambient temple audio player.
 * Exposes the audio element on window.__templeAudio
 * so the Videos page can pause/resume it.
 */
export default function AmbientAudio() {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume]   = useState(0.3)
  const [shown, setShown]     = useState(false)
  const audioRef = useRef(null)

  // Register on window so Videos page can access it
  useEffect(() => {
    const audio = audioRef.current
    if (audio) window.__templeAudio = audio
    return () => { window.__templeAudio = null }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 2500)
    return () => clearTimeout(t)
  }, [])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch(e) {
        console.warn('Audio autoplay blocked:', e)
      }
    }
  }

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  if (!shown) return null

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/audio/temple-bells.mp3" type="audio/mpeg" />
        <source src="/audio/temple-bells.ogg" type="audio/ogg" />
      </audio>

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          zIndex: 9000,
          background: 'rgba(8,12,23,0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(201,168,76,0.22)',
          borderRadius: 12,
          padding: '0.6rem 1rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}
      >
        <motion.button
          onClick={toggle}
          whileTap={{ scale: 0.9 }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
          title={playing ? 'Pause temple music' : 'Play temple music'}
        >
          {playing ? '🔊' : '🔇'}
        </motion.button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <span style={{ color: 'var(--gold)', fontFamily: 'Cinzel', fontSize: '0.62rem', letterSpacing: '0.15em' }}>
            {playing ? 'TEMPLE MUSIC' : 'MUTED'}
          </span>
          <input
            type="range" min={0} max={1} step={0.05}
            value={volume}
            onChange={handleVolume}
            style={{
              width: 70, height: 3, cursor: 'pointer',
              accentColor: 'var(--gold)',
            }}
          />
        </div>

        <motion.button
          onClick={() => setShown(false)}
          whileTap={{ scale: 0.9 }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ivory-dim)', fontSize: '0.8rem', lineHeight: 1 }}
        >✕</motion.button>
      </motion.div>
    </>
  )
}
