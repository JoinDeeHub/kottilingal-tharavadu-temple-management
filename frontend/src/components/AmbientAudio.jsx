import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AmbientAudio() {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    let ctx, masterGain, oscillators = []

    const createOmDrone = (audioCtx, destination) => {
      // Deep Om drone: base 110Hz (A2) with rich harmonics
      const configs = [
        { freq: 110,  gain: 0.18, type: 'sine' },
        { freq: 220,  gain: 0.10, type: 'sine' },
        { freq: 330,  gain: 0.06, type: 'sine' },
        { freq: 440,  gain: 0.03, type: 'sine' },
        { freq: 55,   gain: 0.12, type: 'sine' }, // sub-bass warmth
      ]
      configs.forEach(({ freq, gain, type }) => {
        const osc = audioCtx.createOscillator()
        const oscGain = audioCtx.createGain()
        // Slight detune for warmth / chorus effect
        osc.type = type
        osc.frequency.value = freq
        osc.detune.value = (Math.random() - 0.5) * 8
        oscGain.gain.value = gain
        // Slow vibrato LFO
        const lfo = audioCtx.createOscillator()
        const lfoGain = audioCtx.createGain()
        lfo.frequency.value = 0.15 + Math.random() * 0.1
        lfoGain.gain.value = freq * 0.003
        lfo.connect(lfoGain)
        lfoGain.connect(osc.frequency)
        lfo.start()
        osc.connect(oscGain)
        oscGain.connect(destination)
        osc.start()
        oscillators.push(osc, lfo)
      })
    }

    const createBellLayer = (audioCtx, destination, time) => {
      // Temple bell: inharmonic partials that decay — like a singing bowl / Om bell
      const bellPartials = [
        { freq: 432,  gainPeak: 0.15, decay: 4.0 },
        { freq: 864,  gainPeak: 0.07, decay: 2.5 },
        { freq: 1296, gainPeak: 0.03, decay: 1.5 },
        { freq: 540,  gainPeak: 0.08, decay: 3.2 },
      ]
      bellPartials.forEach(({ freq, gainPeak, decay }) => {
        const osc = audioCtx.createOscillator()
        const g = audioCtx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        g.gain.setValueAtTime(0, time)
        g.gain.linearRampToValueAtTime(gainPeak, time + 0.01)
        g.gain.exponentialRampToValueAtTime(0.0001, time + decay)
        osc.connect(g)
        g.connect(destination)
        osc.start(time)
        osc.stop(time + decay + 0.1)
      })
    }

    const start = () => {
      if (started) return
      setStarted(true)
      setShowHint(false)

      ctx = new (window.AudioContext || window.webkitAudioContext)()

      // Master gain — fade in gently
      masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(0, ctx.currentTime)
      masterGain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 4)
      masterGain.connect(ctx.destination)

      // Reverb (convolver with impulse response synthesis)
      const reverbNode = ctx.createConvolver()
      const reverbLen = ctx.sampleRate * 3
      const reverbBuf = ctx.createBuffer(2, reverbLen, ctx.sampleRate)
      for (let ch = 0; ch < 2; ch++) {
        const data = reverbBuf.getChannelData(ch)
        for (let i = 0; i < reverbLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 2.5)
        }
      }
      reverbNode.buffer = reverbBuf

      const dryGain = ctx.createGain()
      const wetGain = ctx.createGain()
      dryGain.gain.value = 0.6
      wetGain.gain.value = 0.4

      const droneOut = ctx.createGain()
      droneOut.connect(dryGain)
      droneOut.connect(reverbNode)
      reverbNode.connect(wetGain)
      dryGain.connect(masterGain)
      wetGain.connect(masterGain)

      createOmDrone(ctx, droneOut)

      // Ring temple bell immediately, then every ~18 seconds
      createBellLayer(ctx, masterGain, ctx.currentTime + 0.5)
      const bellInterval = setInterval(() => {
        if (ctx && ctx.state === 'running') {
          createBellLayer(ctx, masterGain, ctx.currentTime)
        }
      }, 18000)

      audioRef.current = { ctx, masterGain, oscillators, bellInterval }
    }

    const handleInteraction = () => start()
    window.addEventListener('click', handleInteraction, { once: true })
    window.addEventListener('touchstart', handleInteraction, { once: true })

    const handleVisibility = () => {
      const { masterGain: mg, ctx: c } = audioRef.current || {}
      if (!mg || !c) return
      if (document.hidden) {
        mg.gain.linearRampToValueAtTime(0, c.currentTime + 1)
      } else if (!muted) {
        mg.gain.linearRampToValueAtTime(0.55, c.currentTime + 1)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('visibilitychange', handleVisibility)
      const { oscillators: oscs, bellInterval: bi, ctx: c } = audioRef.current || {}
      if (bi) clearInterval(bi)
      if (oscs) oscs.forEach(o => { try { o.stop() } catch(e) {} })
      if (c) c.close()
    }
  }, [])

  const toggleMute = (e) => {
    e.stopPropagation()
    const { masterGain: mg, ctx: c } = audioRef.current || {}
    if (!mg || !c) return
    const next = !muted
    setMuted(next)
    mg.gain.linearRampToValueAtTime(next ? 0 : 0.55, c.currentTime + 1.5)
  }

  return (
    <>
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="fixed bottom-20 right-4 z-50 text-xs text-amber-300/70 bg-black/50 px-3 py-1.5 rounded-full pointer-events-none backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
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
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            {muted ? '🔕' : '🔔'}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
