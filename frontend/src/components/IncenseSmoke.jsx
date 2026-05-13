import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Single smoke particle that drifts upward with turbulence
function SmokeParticle({ index, total }) {
  const meshRef = useRef()
  const speed = useMemo(() => 0.004 + Math.random() * 0.004, [])
  const xOffset = useMemo(() => (Math.random() - 0.5) * 0.3, [])
  const phaseX = useMemo(() => Math.random() * Math.PI * 2, [])
  const phaseZ = useMemo(() => Math.random() * Math.PI * 2, [])
  const startY = useMemo(() => -1.2 - Math.random() * 1.5, [])
  const lifespan = useMemo(() => 2.5 + Math.random() * 2, [])
  const initScale = useMemo(() => 0.05 + Math.random() * 0.08, [])

  const state = useRef({ y: startY, age: Math.random() * lifespan, opacity: 0 })

  useFrame((_, delta) => {
    const s = state.current
    s.age += delta
    if (s.age > lifespan) {
      s.age = 0
      s.y = startY
    }
    const t = s.age / lifespan
    s.y = startY + t * 3.5

    const x = xOffset + Math.sin(s.age * 1.1 + phaseX) * 0.12 * t
    const z = Math.cos(s.age * 0.9 + phaseZ) * 0.08 * t
    const scale = initScale + t * 0.45
    const opacity = t < 0.15 ? t / 0.15 : t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1

    if (meshRef.current) {
      meshRef.current.position.set(x, s.y, z)
      meshRef.current.scale.setScalar(scale)
      meshRef.current.material.opacity = opacity * 0.35
      meshRef.current.rotation.y += delta * 0.3
      meshRef.current.rotation.z += delta * 0.15
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#d4c5a0"
        transparent
        opacity={0}
        depthWrite={false}
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}

// The glowing incense stick tip ember
function Ember() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime()
      ref.current.intensity = 1.2 + Math.sin(t * 3) * 0.4
    }
  })
  return (
    <>
      {/* Stick body */}
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
        <meshStandardMaterial color="#5c3a1e" />
      </mesh>
      {/* Glowing tip */}
      <mesh position={[0, -1.18, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={2} />
      </mesh>
      {/* Point light at tip */}
      <pointLight ref={ref} position={[0, -1.18, 0]} color="#ff6600" intensity={1.2} distance={1.5} />
    </>
  )
}

function SmokeScene() {
  const PARTICLE_COUNT = 28
  return (
    <>
      <ambientLight intensity={0.1} />
      <Ember />
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <SmokeParticle key={i} index={i} total={PARTICLE_COUNT} />
      ))}
    </>
  )
}

export default function IncenseSmoke({ className = '' }) {
  return (
    <div className={`pointer-events-none ${className}`} style={{ width: 80, height: 220 }}>
      <Canvas
        camera={{ position: [0, 0.5, 2.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <SmokeScene />
      </Canvas>
    </div>
  )
}
