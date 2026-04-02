import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function FloatingParticles({ count = 60 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null)

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      pos: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
      ] as [number, number, number],
      scale: Math.random() * 0.06 + 0.015,
      speed: Math.random() * 0.5 + 0.15,
      color: ['#bf00ff', '#00f0ff', '#ff00ff', '#39ff14', '#ff6b00'][
        Math.floor(Math.random() * 5)
      ],
    }))
  }, [count])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i]
      if (!p) return
      child.position.y += Math.sin(state.clock.elapsedTime * p.speed + i) * 0.002
      child.position.x += Math.cos(state.clock.elapsedTime * p.speed * 0.5 + i) * 0.0015
      child.rotation.x = state.clock.elapsedTime * p.speed * 0.2
      child.rotation.z = state.clock.elapsedTime * p.speed * 0.15
    })
  })

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos} scale={p.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

function GlowingKnot() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.4
    ref.current.rotation.y = state.clock.elapsedTime * 0.15
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.15
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={ref} position={[0, 0, -5]}>
        <torusKnotGeometry args={[2.2, 0.4, 128, 16]} />
        <meshStandardMaterial
          color="#bf00ff"
          emissive="#bf00ff"
          emissiveIntensity={0.12}
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </Float>
  )
}

export function Background3D() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[10, 10, 10]} color="#bf00ff" intensity={0.7} />
        <pointLight position={[-10, -10, 5]} color="#00f0ff" intensity={0.4} />
        <FloatingParticles />
        <GlowingKnot />
      </Canvas>
    </div>
  )
}
