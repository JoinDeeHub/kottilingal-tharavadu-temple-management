import { useEffect, useRef } from 'react'

/**
 * Cinematic incense stick with Three.js GPU particle smoke.
 * Scroll-reactive: smoke billows faster as user scrolls.
 * Falls back silently if WebGL is unavailable.
 */
export default function IncenseSmoke({ x = 0, flipped = false }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let THREE, renderer, scene, camera, animId
    let scrollV = 0

    const onScroll = () => { scrollV = Math.min(window.scrollY / 400, 1) }
    window.addEventListener('scroll', onScroll, { passive: true })

    const init = async () => {
      try {
        THREE = await import('three')

        const W = 120, H = 420
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        renderer.setSize(W, H)
        renderer.setClearColor(0x000000, 0)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        el.appendChild(renderer.domElement)

        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
        camera.position.set(0, 0, 3.5)

        // ── Incense stick geometry ──
        const stickG = new THREE.CylinderGeometry(0.018, 0.025, 2.2, 8)
        const stickM = new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        const stick = new THREE.Mesh(stickG, stickM)
        stick.position.set(0, -1.0, 0)
        scene.add(stick)

        // Glowing amber tip
        const tipG = new THREE.SphereGeometry(0.045, 8, 8)
        const tipM = new THREE.MeshStandardMaterial({
          color: 0xFF4500, emissive: 0xFF3300,
          emissiveIntensity: 2.5,
        })
        const tip = new THREE.Mesh(tipG, tipM)
        tip.position.set(0, 0.12, 0)
        scene.add(tip)

        // Sandal-orange point light at tip
        const flame = new THREE.PointLight(0xFF6600, 2.5, 2.5)
        flame.position.copy(tip.position)
        scene.add(flame)

        // Ambient fill
        scene.add(new THREE.AmbientLight(0xC9A84C, 0.6))

        // ── Smoke particle system ──
        const COUNT = 180
        const positions = new Float32Array(COUNT * 3)
        const velocities = []
        const ages = []
        const maxAge = 120

        for (let i = 0; i < COUNT; i++) {
          const t = (i / COUNT) * maxAge
          ages.push(t)
          velocities.push({
            x: (Math.random() - 0.5) * 0.004,
            y: 0.008 + Math.random() * 0.006,
            spread: Math.random() * 0.003,
          })
          positions[i * 3]     = (Math.random() - 0.5) * 0.06
          positions[i * 3 + 1] = tip.position.y + (t / maxAge) * 2.8
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.06
        }

        const pGeo = new THREE.BufferGeometry()
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        // Soft circle texture
        const canvas2 = document.createElement('canvas')
        canvas2.width = canvas2.height = 64
        const ctx = canvas2.getContext('2d')
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
        g.addColorStop(0,   'rgba(220,200,180,0.9)')
        g.addColorStop(0.4, 'rgba(180,160,140,0.5)')
        g.addColorStop(1,   'rgba(100,80,60,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, 64, 64)
        const tex = new THREE.CanvasTexture(canvas2)

        const pMat = new THREE.PointsMaterial({
          size: 0.18,
          map: tex,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexColors: false,
          color: 0xC8B4A0,
        })

        const particles = new THREE.Points(pGeo, pMat)
        scene.add(particles)

        let t = 0
        const animate = () => {
          animId = requestAnimationFrame(animate)
          t++

          const pos = pGeo.attributes.position.array
          const speedMult = 1 + scrollV * 2.5

          for (let i = 0; i < COUNT; i++) {
            ages[i]++
            if (ages[i] > maxAge) {
              // Reset to tip
              ages[i] = 0
              pos[i*3]     = (Math.random()-0.5)*0.06
              pos[i*3+1]   = tip.position.y
              pos[i*3+2]   = (Math.random()-0.5)*0.06
              velocities[i].x = (Math.random()-0.5)*0.004
            }
            const a = ages[i] / maxAge
            // Drift & rise
            pos[i*3]   += velocities[i].x + Math.sin(t*0.03 + i) * velocities[i].spread
            pos[i*3+1] += velocities[i].y * speedMult
            pos[i*3+2] += Math.cos(t*0.02 + i*0.5) * 0.001
          }
          pGeo.attributes.position.needsUpdate = true

          // Flicker tip
          flame.intensity = 2 + Math.sin(t * 0.18) * 0.8 + scrollV * 1.5
          tipM.emissiveIntensity = 2 + Math.sin(t * 0.22) * 0.6

          renderer.render(scene, camera)
        }
        animate()
      } catch(e) {
        console.warn('IncenseSmoke WebGL init failed:', e)
      }
    }

    init()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('scroll', onScroll)
      try { renderer?.dispose() } catch(e) {}
      if (el.firstChild) el.removeChild(el.firstChild)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        width: 120, height: 420,
        transform: flipped ? 'scaleX(-1)' : 'none',
        pointerEvents: 'none',
      }}
    />
  )
}
