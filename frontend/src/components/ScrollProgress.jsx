import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [p, setP] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const scrolled = doc.scrollTop
      const total = doc.scrollHeight - doc.clientHeight
      setP(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: `${p}%`, height: '2px',
      background: 'linear-gradient(90deg, var(--crimson), var(--gold), var(--gold-bright))',
      zIndex: 9999,
      transition: 'width 0.1s linear',
      boxShadow: '0 0 8px rgba(201,168,76,0.6)',
    }} />
  )
}
