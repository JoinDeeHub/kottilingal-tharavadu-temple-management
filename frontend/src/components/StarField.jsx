import { useEffect, useRef } from 'react'

export default function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = window.innerWidth, H = window.innerHeight
    let animId
    let scroll = 0

    canvas.width = W
    canvas.height = H

    // Generate stars
    const STARS = 180
    const stars = Array.from({ length: STARS }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      opacity: Math.random() * 0.7 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }))

    // Gold dust particles
    const DUST = 35
    const dust = Array.from({ length: DUST }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.4 + 0.1,
      drift: (Math.random() - 0.5) * 0.3,
    }))

    const onScroll = () => { scroll = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', onResize)

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t += 0.016

      // Parallax offset based on scroll
      const py = scroll * 0.08

      // Draw stars
      stars.forEach(s => {
        s.twinkle += s.twinkleSpeed
        const op = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle))
        ctx.beginPath()
        ctx.arc(s.x, (s.y - py * s.speed * 20) % H, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245, 237, 214, ${op})`
        ctx.fill()
      })

      // Draw gold dust
      dust.forEach(d => {
        d.y -= d.speed
        d.x += d.drift
        if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W }
        if (d.x < 0 || d.x > W) d.drift *= -1
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 168, 76, ${d.opacity})`
        ctx.fill()
      })

      // Subtle crimson horizon glow at top
      const grad = ctx.createLinearGradient(0, 0, 0, H * 0.3)
      grad.addColorStop(0, 'rgba(139,0,0,0.06)')
      grad.addColorStop(1, 'rgba(139,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H * 0.3)

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85,
      }}
    />
  )
}
