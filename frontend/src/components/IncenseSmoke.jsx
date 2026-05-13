import { useRef, useMemo, Component } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

class SmokeErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { crashed: false } }
  static getDerivedStateFromError() { return { crashed: true } }
  render() {
    if (this.state.crashed) return null // silently hide if WebGL fails
    return this.props.children
  }
}

function SmokeParticle({ index }) {
  const meshRef = useRef()
  const speed    = useMemo(() => 0.004 + Math.random() * 0.004, [])
  const xOffset  = useMemo(() => (Math.random() - 0.5) * 0.3, [])
  const phaseX   = useMemo(() => Math.random() * Math.PI * 2, [])
  const phaseZ   = useMemo(() => Math.random() * Math.PI * 2, [])
  const startY   = useMemo(() => -1.2 - Math.random() * 1.5, [])
  const lifespan = useMemo(() => 2.5 + Math.random() * 2, [])
  const initScale= useMemo(() => 0.05 + Math.random() * 0.08, [])
  const state    = useRef({ y: startY, age: Math.random() * lifespan })

  useFrame((_, delta) => {
    const s = state.current
    s.age += delta
    if (s.age > lifespan) { s.age = 0 }
    const t = s.age / lifespan
    const x = xOffset + Math.sin(s.age * 1.1 + phaseX) * 0.12 * t
    const y = startY + t * 3.5
    const z = Math.cos(s.age * 0.9 + phaseZ) * 0.08 * t
    const scale = initScale + t * 0.45
    const opacity = t < 0.15 ? t / 0.15 : t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1
    if (meshRef.current) {
      meshRef.current.position.set(x, y, z)
      meshRef.current.scale.setScalar(scale)
      meshRef.current.material.opacity = opacity * 0.32
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#c8bfa0" transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

function Ember() {
  const lightRef = useRef()
  useFrame(({ clock }) => {
    if (lightRef.current) lightRef.current.intensity = 1.2 + Math.sin(clock.getElapsedTime() * 3) * 0.4
  })
  return (
    <>
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
        <meshStandardMaterial color="#5c3a1e" />
      </mesh>
      <mesh position={[0, -1.18, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={2} />
      </mesh>
      <pointLight ref={lightRef} position={[0, -1.18, 0]} color="#ff6600" intensity={1.2} distance={1.5} />
    </>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <Ember />
      {Array.from({ length: 22 }).map((_, i) => <SmokeParticle key={i} index={i} />)}
    </>
  )
}

export default function IncenseSmoke({ className = '' }) {
  return (
    <SmokeErrorBoundary>
      <div className={`pointer-events-none ${className}`} style={{ width: 80, height: 220 }}>
        <Canvas
          camera={{ position: [0, 0.5, 2.5], fov: 45 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
          style={{ background: 'transparent' }}
          onCreated={({ gl }) => { gl.setClearColor(0x000000, 0) }}
        >
          <Scene />
        </Canvas>
      </div>
    </SmokeErrorBoundary>
  )
}
