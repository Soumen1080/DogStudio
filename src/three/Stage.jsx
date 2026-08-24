import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'

import Dog from './Dog'
import { rig } from '../lib/store'

/**
 * The fixed WebGL stage that sits behind every section.
 *
 * Nothing in here scrolls — the page scrolls past it while ScrollTrigger moves
 * the object. That is the whole trick behind a scroll-driven 3D site: one
 * persistent context, zero re-mounts, no scroll-jank from canvas reflow.
 */
export default function Stage() {
  /* Normalised pointer, written straight into the rig (no React state — this
     fires on every mousemove and must never cause a render). */
  useEffect(() => {
    const onMove = (e) => {
      rig.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      rig.pointerY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div className="stage" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.2], fov: 34, near: 0.1, far: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          // Matcaps are authored as a finished look; tone mapping would
          // re-grade them and mute the brass.
          toneMapping: THREE.NoToneMapping,
        }}
      >
        <Suspense fallback={null}>
          {/* Matcap surfaces ignore lights entirely — these are here for the
              foliage, which uses a standard material. */}
          <ambientLight intensity={0.85} />
          <directionalLight position={[4, 6, 5]} intensity={1.15} color="#fff2d8" />
          <directionalLight position={[-5, 2, -3]} intensity={0.4} color="#8fa6c8" />

          <Dog />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
