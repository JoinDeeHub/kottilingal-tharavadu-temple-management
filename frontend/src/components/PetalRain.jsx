import { useEffect, useRef } from 'react'

export default function PetalRain() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const petals = ['🌸', '🌺', '🌼', '✨', '🪷']
    const intervals = []

    const createPetal = () => {
      const petal = document.createElement('div')
      petal.textContent = petals[Math.floor(Math.random() * petals.length)]
      petal.style.cssText = `
        position: fixed;
        top: -50px;
        left: ${Math.random() * 100}vw;
        font-size: ${Math.random() * 16 + 10}px;
        opacity: ${Math.random() * 0.6 + 0.3};
        pointer-events: none;
        z-index: 0;
        animation: petal-fall ${Math.random() * 4 + 4}s linear forwards;
        transform: rotate(${Math.random() * 360}deg);
      `
      container.appendChild(petal)
      setTimeout(() => petal.remove(), 8000)
    }

    const interval = setInterval(createPetal, 800)
    intervals.push(interval)
    return () => intervals.forEach(clearInterval)
  }, [])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />
}
