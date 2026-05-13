import { useEffect, useRef, useState } from 'react'

/**
 * Wraps children with scroll-driven transform.
 * speed: 0.1 = subtle, 0.5 = dramatic
 * direction: 'up' | 'down' | 'left' | 'right' | 'scale' | 'rotate'
 */
export default function ScrollParallax({
  children,
  speed = 0.2,
  direction = 'up',
  className = '',
  style = {},
}) {
  const ref = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const calc = () => {
      const rect = el.getBoundingClientRect()
      const viewH = window.innerHeight
      const center = rect.top + rect.height / 2 - viewH / 2
      setOffset(center * speed)
    }

    calc()
    window.addEventListener('scroll', calc, { passive: true })
    window.addEventListener('resize', calc)
    return () => {
      window.removeEventListener('scroll', calc)
      window.removeEventListener('resize', calc)
    }
  }, [speed])

  const getTransform = () => {
    switch (direction) {
      case 'up':     return `translateY(${-offset}px)`
      case 'down':   return `translateY(${offset}px)`
      case 'left':   return `translateX(${-offset}px)`
      case 'right':  return `translateX(${offset}px)`
      case 'scale':  return `scale(${1 + Math.abs(offset) * 0.0005})`
      case 'rotate': return `rotate(${offset * 0.02}deg)`
      default:       return `translateY(${-offset}px)`
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: getTransform(), willChange: 'transform', ...style }}
    >
      {children}
    </div>
  )
}
