import { useEffect, useRef } from 'react'

export default function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const transforms = {
      up:    'translateY(50px)',
      down:  'translateY(-50px)',
      left:  'translateX(60px)',
      right: 'translateX(-60px)',
      scale: 'scale(0.85)',
    }

    el.style.opacity = '0'
    el.style.transform = transforms[direction] || transforms.up
    el.style.transition = `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1'
        el.style.transform = 'none'
        observer.unobserve(el)
      }
    }, { threshold: 0.12 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={className}>{children}</div>
}
