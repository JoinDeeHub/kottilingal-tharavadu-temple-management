import { useEffect, useRef } from 'react'

/**
 * Chars split & staggered on scroll into view — David Whyte style.
 */
export default function CinematicText({ text, className = '', tag = 'h1', delay = 0, color = 'var(--gold)' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const chars = text.split('')
    el.innerHTML = chars.map((c, i) =>
      c === ' '
        ? '<span style="display:inline-block;width:0.35em"> </span>'
        : `<span class="ct-char" style="display:inline-block;opacity:0;transform:translateY(60px) rotateX(-40deg);transition:opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay + i * 40}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay + i * 40}ms;">${c}</span>`
    ).join('')

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.ct-char').forEach(span => {
          span.style.opacity = '1'
          span.style.transform = 'translateY(0) rotateX(0)'
        })
        obs.unobserve(el)
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [text, delay])

  const Tag = tag
  return (
    <Tag
      ref={ref}
      className={className}
      style={{ color, perspective: '600px', display: 'block' }}
    />
  )
}
