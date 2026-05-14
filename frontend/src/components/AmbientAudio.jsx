import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Tries to play /om-chant.mp3 if it exists (user places the file in public/)
// Falls back gracefully to Web Audio Om synthesis if file not found
export default function AmbientAudio() {
  const audioRef = useRef(null)
  const synthRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [usingFile, setUsingFile] = useState(false)

  useEffect(() => {
    const startAudio = async () => {
      if (started) return
      setStarted(true)
      setShowHint(false)

      // --- Try HTML Audio file first (/om-chant.mp3) ---
      const audio = new Audio('/om-chant.mp3')
      audio.loop = true
      audio.volume = 0
      try {
        await audio.play()
        // Fade in
        audioRef.current = audio
        setUsingFile(true)
        let vol = 0
        const fade = setInterval(() => {
          vol = Math.min(vol + 0.01, 0.22)
          audio.volume = vol
          if (vol >= 0.22) clearInterval(fade)
        }, 120)
        return
      } catch (e) {
        // File not found or blocked — fall through to synthesis
      }

      // --- Web Audio synthesis fallback ---
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(0, ctx.currentTime)
      masterGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 4)

      // Reverb
      const reverb = ctx.createConvolver()
      const rLen = ctx.sampleRate * 3.5
      const rBuf = ctx.createBuffer(2, rLen, ctx.sampleRate)
      for (let ch = 0; ch < 2; ch++) {
        const d = rBuf.getChannelData(ch)
        for (let i = 0; i < rLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rLen, 2.2)
      }
      reverb.buffer = rBuf

      const dry = ctx.createGain(); dry.gain.value = 0.55
      const wet = ctx.createGain(); wet.gain.value = 0.45
      const droneOut = ctx.createGain()
      droneOut.connect(dry); droneOut.connect(reverb)
      reverb.connect(wet); dry.connect(masterGain); wet.connect(masterGain)
      masterGain.connect(ctx.destination)

      // Om drone layers
      [[110, 0.18], [55, 0.14], [220, 0.09], [330, 0.05], [165, 0.07]].forEach(([freq, g]) => {
        const osc = ctx.createOscillator()
        const og = ctx.createGain()
        osc.type = 'sine'; osc.frequency.value = freq
        osc.detune.value = (Math.random() - 0.5) * 10
        og.gain.value = g
        const lfo = ctx.createOscillator(); const lg = ctx.createGain()
        lfo.frequency.value = 0.12 + Math.random() * 0.08; lg.gain.value = freq * 0.004
        lfo.connect(lg); lg.connect(osc.frequency); lfo.start()
        osc.connect(og); og.connect(droneOut); osc.start()
      })

      // Bell every 20s
      const ringBell = (t) => {
        [[432, 0.14, 4.5], [864, 0.06, 2.8], [1296, 0.03, 1.6]].forEach(([f, gp, dec]) => {
          const o = ctx.createOscillator(); const bg = ctx.createGain()
          o.type = 'sine'; o.frequency.value = f
          bg.gain.setValueAtTime(0, t)
          bg.gain.linearRampToValueAtTime(gp, t + 0.015)
          bg.gain.exponentialRampToValueAtTime(0.0001, t + dec)
          o.connect(bg); bg.connect(masterGain)
          o.start(t); o.stop(t + dec + 0.1)
        })
      }
      ringBell(ctx.currentTime + 0.8)
      const bellInt = setInterval(() => {
        if (ctx.state === 'running') ringBell(ctx.currentTime)
      }, 20000)

      synthRef.current = { ctx, masterGain, bellInt }
    }

    const onInteract = () => startAudio()
    window.addEventListener('click', onInteract, { once: true })
    window.addEventListener('touchstart', onInteract, { once: true })

    const onVisibility = () => {
      if (audioRef.current) {
        document.hidden ? (audioRef.current.volume = 0) : (!muted && (audioRef.current.volume = 0.22))
      }
      if (synthRef.current) {
        const { ctx, masterGain } = synthRef.current
        masterGain.gain.linearRampToValueAtTime(
          document.hidden ? 0 : (muted ? 0 : 0.5), ctx.currentTime + 1
        )
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.removeEventListener('click', onInteract)
      window.removeEventListener('touchstart', onInteract)
      document.removeEventListener('visibilitychange', onVisibility)
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
      if (synthRef.current) {
        clearInterval(synthRef.current.bellInt)
        synthRef.current.ctx.close()
      }
    }
  }, [])

  const toggleMute = (e) => {
    e.stopPropagation()
    const next = !muted
    setMuted(next)
    if (audioRef.current) {
      audioRef.current.volume = next ? 0 : 0.22
    }
    if (synthRef.current) {
      const { ctx, masterGain } = synthRef.current
      masterGain.gain.linearRampToValueAtTime(next ? 0 : 0.5, ctx.currentTime + 1.2)
    }
  }

  return (
    <>
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="fixed bottom-20 right-4 z-50 text-xs text-amber-300/70 bg-black/50 px-3 py-1.5 rounded-full pointer-events-none backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ delay: 2.5, duration: 1 }}
          >
            🔔 Click anywhere to awaken the temple ambience
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {started && (
          <motion.button
            onClick={toggleMute}
            className="fixed bottom-4 right-4 z-50 w-11 h-11 rounded-full bg-black/60 border border-yellow-600/50 flex items-center justify-center text-xl hover:bg-yellow-900/50 transition-all backdrop-blur-sm"
            title={muted ? 'Unmute Om ambience' : 'Mute Om ambience'}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          >
            {muted ? '🔕' : '🔔'}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
