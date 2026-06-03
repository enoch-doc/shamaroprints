import { useRef, useMemo }         from 'react'
import { Canvas, useFrame,
         useThree }                 from '@react-three/fiber'
import * as THREE                   from 'three'

/* ── Lights with animation ── */
function Lights() {
  const l1 = useRef(null)
  const l2 = useRef(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (l1.current) l1.current.intensity = 4 + Math.sin(t * 0.8) * 1
    if (l2.current) l2.current.intensity = 2 + Math.cos(t * 0.6) * 0.7
  })

  return (
    <>
      <ambientLight intensity={0.4} color="#1a1200" />
      <pointLight
        ref={l1}
        position={[3, 4, 4]}
        color="#fdbf00"
        intensity={4}
        distance={24}
      />
      <pointLight
        ref={l2}
        position={[-4, -2, 2]}
        color="#e8a921"
        intensity={2}
        distance={18}
      />
      <pointLight
        position={[0, -5, -2]}
        color="#ca7312"
        intensity={1.5}
        distance={14}
      />
      <directionalLight
        position={[2, 6, 2]}
        color="#fdbf00"
        intensity={0.5}
      />
    </>
  )
}

/* ── Orbiting product shapes ── */
function Orbiters() {
  const refs   = useRef([])
  const angles = useRef([0, 1.88, 3.77, 5.34, 0.94, 6.91])

  const shapes = [
    { r: 4.0, y: -0.4, s: 0.0024, geo: 'box',   c: '#fdbf00', args: [0.45, 0.65, 0.07] },
    { r: 3.6, y:  0.7, s: 0.0019, geo: 'sphere', c: '#fdbf00', args: [0.2,  16,   16  ] },
    { r: 4.4, y: -0.7, s: 0.0029, geo: 'cyl',    c: '#ca7312', args: [0.11, 0.14, 0.7, 20] },
    { r: 3.4, y:  0.4, s: 0.0031, geo: 'torus',  c: '#e8a921', args: [0.2,  0.055, 8, 24, Math.PI] },
    { r: 4.7, y: -1.1, s: 0.0033, geo: 'box',    c: '#e8a921', args: [0.35, 0.5,  0.06] },
    { r: 3.9, y:  0.9, s: 0.0026, geo: 'icosa',  c: '#fdbf00', args: [0.28, 1] },
  ]

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()
    shapes.forEach((sh, i) => {
      angles.current[i] += sh.s
      const m = refs.current[i]
      if (!m) return
      m.position.x  = Math.cos(angles.current[i]) * sh.r
      m.position.z  = Math.sin(angles.current[i]) * sh.r * 0.5
      m.position.y  = sh.y + Math.sin(t * 0.45 + angles.current[i]) * 0.28
      m.rotation.y += delta * 0.55
      m.rotation.x += delta * 0.18
    })
  })

  return (
    <>
      {shapes.map((sh, i) => (
        <mesh key={i} ref={el => (refs.current[i] = el)}>
          {sh.geo === 'box'    && <boxGeometry          args={sh.args} />}
          {sh.geo === 'sphere' && <sphereGeometry       args={sh.args} />}
          {sh.geo === 'cyl'    && <cylinderGeometry     args={sh.args} />}
          {sh.geo === 'torus'  && <torusGeometry        args={sh.args} />}
          {sh.geo === 'icosa'  && <icosahedronGeometry  args={sh.args} />}
          <meshStandardMaterial
            color={sh.c}
            metalness={0.9}
            roughness={0.13}
            emissive={sh.c}
            emissiveIntensity={0.06}
          />
        </mesh>
      ))}
    </>
  )
}

/* ── Gold dust particles ── */
function Particles() {
  const mesh  = useRef(null)
  const N     = 380

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(N * 3)
    const ph  = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12
      ph[i]          = Math.random() * Math.PI * 2
    }
    return [pos, ph]
  }, [])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t   = clock.getElapsedTime()
    const arr = mesh.current.geometry.attributes.position.array
    for (let i = 0; i < N; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.22 + phases[i]) * 0.0005
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
    mesh.current.rotation.y = t * 0.0012
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={N}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#fdbf00"
        size={0.035}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

/* ── Mouse parallax camera ── */
function CameraRig() {
  const { mouse } = useThree()

  useFrame(({ camera }) => {
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.028
    camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.028
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ── Background wireframe sphere ── */
function BgSphere() {
  const mesh = useRef(null)
  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.rotation.y = t * 0.008
    mesh.current.rotation.x = t * 0.005
  })
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[7, 22, 22]} />
      <meshBasicMaterial
        color="#fdbf00"
        wireframe
        transparent
        opacity={0.018}
      />
    </mesh>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 52 }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        gl.toneMapping         = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.2
      }}
      style={{ background: 'transparent' }}
    >
      <Lights />
      <CameraRig />
      <Orbiters />
      <Particles />
      <BgSphere />
    </Canvas>
  )
}