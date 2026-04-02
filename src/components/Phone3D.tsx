import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export function Phone3D({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const tx = (state.pointer.x * Math.PI) / 7
    const ty = (state.pointer.y * Math.PI) / 7
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -ty, 0.04)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, tx, 0.04)
  })

  return (
    <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={groupRef}>
        <RoundedBox args={[3.2, 6.5, 0.2]} radius={0.3} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#080808" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        <RoundedBox args={[3.3, 6.6, 0.1]} radius={0.35} smoothness={4} position={[0, 0, -0.05]}>
          <meshBasicMaterial color="#b026ff" transparent opacity={0.25} />
        </RoundedBox>
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[3.0, 6.2]} />
          <meshBasicMaterial color="#020202" />
        </mesh>
        <Html
          transform
          wrapperClass="phone-wrapper"
          distanceFactor={1.5}
          position={[0, 0, 0.12]}
          style={{
            width: '320px',
            height: '660px',
            backgroundColor: '#050505',
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 30px rgba(176, 38, 255, 0.08)',
            border: '4px solid rgba(255, 255, 255, 0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Html>
      </group>
    </Float>
  )
}
