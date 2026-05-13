import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AmbientAudio() {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)
  const [showHint, setShowHint] = useState(true)

  // Free-to-use Om chant from a public CDN
  const SRC = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
  // We generate a soft Om tone via Web Audio API instead — no external dependency

  useEffect(() => {
    // Create audio context and generate a soft Om-like drone
    let ctx, gainNode, oscillators = [], interval

    const start = () => {
      if (started) return
      setStarted(true)
      setShowHint(false)

      ctx = new (window.AudioContext || window.webkitAudioContext)()
      gainNode = ctx.createGain()
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 3) // fade in gently
      gainNode.connect(ctx.destination)

      // Om drone: fundamental + harmonics (A2 = 110Hz base)
      const freqs = [110, 165, 220, 275, 330]
      const gains = [1, 0.5, 0.3, 0.15, 0.08]

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const oscGain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        // Slow vibrato for warmth
        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()
        lfo.frequency.value = 0.2 + idx * 0.05
        lfoGain.gain.value = 0.8
        lfo.connect(lfoGain)
        lfoGain.connect(osc.frequency)
        lfo.start()
        oscGain.gain.value = gains[idx] * 0.4
        osc.connect(oscGain)
        oscGain.connect(gainNode)
        osc.start()
        oscillators.push(osc, lfo)
      })
    }

    const handleInteraction = () => start()
    window.addEventListener('click', handleInteraction, { once: true })
    window.addEventListener('touchstart', handleInteraction, { once: true })

    // Pause when tab hidden
    const handleVisibility = () => {
      if (!gainNode) return
      if (document.hidden) {
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1)
      } else if (!muted) {
        gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // Store refs for mute toggle
    audioRef.current = { ctx, gainNode, oscillators }

    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('visibilitychange', handleVisibility)
      oscillators.forEach(o => { try { o.stop() } catch(e) {} })
      if (ctx) ctx.close()
    }
  }, [])

  const toggleMute = (e) => {
    e.stopPropagation()
    const { gainNode, ctx } = audioRef.current || {}
    if (!gainNode || !ctx) return
    const next = !muted
    setMuted(next)
    gainNode.gain.linearRampToValueAtTime(
      next ? 0 : 0.06,
      ctx.currentTime + 1
    )
  }

  return (
    <>
      {/* Floating hint on load */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="fixed bottom-20 right-4 z-50 text-xs text-amber-300/70 bg-black/40 px-3 py-1.5 rounded-full pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2, duration: 1 }}
          >
            🎵 Click anywhere for ambient Om
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute toggle button — only shown after audio starts */}
      <AnimatePresence>
        {started && (
          <motion.button
            onClick={toggleMute}
            className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 border border-yellow-600/40 flex items-center justify-center text-lg hover:bg-yellow-900/40 transition-all"
            title={muted ? 'Unmute ambient Om' : 'Mute ambient Om'}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {muted ? '🔕' : '🔔'}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
