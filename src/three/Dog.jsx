import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useGLTF, useTexture, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { FINISHES } from '../lib/content'
import { rig, useStore } from '../lib/store'

const MODEL = '/models/dog.drc.glb'
const MATCAPS = FINISHES.items.map((f) => f.map)
const EYE_MATCAP = '/matcap/mat-6.png' // deep gloss — reads as a wet eye
const DOG_NORMAL = '/models/dog_normals.jpg'
const BRANCH_MAPS = ['/branches_normals.jpeg', '/branches_diffuse.jpeg']

useGLTF.preload(MODEL)

/**
 * Matcaps are authored images, so they decode as sRGB and keep the loader's
 * default flipY. Flipping a matcap turns light-from-above into
 * light-from-below — the single most common reason a matcap object looks
 * uncannily lit from the floor.
 */
function asMatcap(input) {
  for (const t of [].concat(input)) {
    t.colorSpace = THREE.SRGBColorSpace
    t.flipY = true
    t.needsUpdate = true
  }
}

/** Normal maps store vectors, not colour; decoding them as sRGB skews every
 *  surface angle. glTF-authored maps also want flipY off. */
function asNormalMap(t) {
  t.colorSpace = THREE.NoColorSpace
  t.flipY = false
  t.needsUpdate = true
}

function asBranchMaps([normal, diffuse]) {
  normal.colorSpace = THREE.NoColorSpace
  diffuse.colorSpace = THREE.SRGBColorSpace
  diffuse.anisotropy = 4
  normal.needsUpdate = true
  diffuse.needsUpdate = true
}

/**
 * Patch MeshMatcapMaterial so it samples *two* matcaps and mixes between them.
 *
 * Three has no built-in way to cross-fade matcaps — swapping the texture pops.
 * Injecting a second sampler plus a `uMix` uniform lets us tween one float and
 * dissolve the entire surface finish. A view-space rim term goes in at the same
 * time; that is what lifts the silhouette off a near-black page.
 */
function patchMatcap(material, initial, rimColor) {
  const uniforms = {
    uMatcapB: { value: initial },
    uMix: { value: 0 },
    uRimColor: { value: new THREE.Color(rimColor) },
    uRimStrength: { value: 0.34 },
    uRimPower: { value: 2.6 },
  }

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)

    shader.fragmentShader = shader.fragmentShader
      .replace(
        'uniform sampler2D matcap;',
        `uniform sampler2D matcap;
         uniform sampler2D uMatcapB;
         uniform float uMix;
         uniform vec3 uRimColor;
         uniform float uRimStrength;
         uniform float uRimPower;`,
      )
      .replace(
        'vec4 matcapColor = texture2D( matcap, uv );',
        `vec4 matcapColor = mix(
           texture2D( matcap, uv ),
           texture2D( uMatcapB, uv ),
           uMix
         );`,
      )
      .replace(
        'vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;',
        `float rim = pow( 1.0 - clamp( dot( viewDir, normal ), 0.0, 1.0 ), uRimPower );
         vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb + uRimColor * rim * uRimStrength;`,
      )
  }

  material.userData.uniforms = uniforms
  // Distinct cache key so this variant never shares a compiled program with a
  // stock MeshMatcapMaterial elsewhere in the scene.
  material.customProgramCacheKey = () => 'braque-dual-matcap'

  return material
}

export default function Dog() {
  const group = useRef()
  const { scene, animations } = useGLTF(MODEL)
  const { actions } = useAnimations(animations, scene)

  const finish = useStore((s) => s.finish)

  /* --- textures ---------------------------------------------------------- */
  /* Configuration happens in useTexture's own onLoad hook — the one place drei
     guarantees runs before first paint. The callbacks are module-level so their
     identity is stable across renders. */

  const matcaps = useTexture(MATCAPS, asMatcap)
  const eyeMatcap = useTexture(EYE_MATCAP, asMatcap)
  const dogNormal = useTexture(DOG_NORMAL, asNormalMap)
  const [branchNormal, branchDiffuse] = useTexture(BRANCH_MAPS, asBranchMaps)

  /* --- materials --------------------------------------------------------- */
  /* Owned for the lifetime of the page (there is exactly one Dog), so there is
     deliberately no dispose-on-unmount: under StrictMode that would tear down
     materials the second effect pass then re-assigns. */

  const materials = useMemo(() => {
    const body = patchMatcap(
      new THREE.MeshMatcapMaterial({
        matcap: matcaps[0],
        normalMap: dogNormal,
        normalScale: new THREE.Vector2(0.65, 0.65),
      }),
      matcaps[0],
      '#ebcb8a',
    )

    const eyes = new THREE.MeshMatcapMaterial({ matcap: eyeMatcap })

    const branches = new THREE.MeshStandardMaterial({
      map: branchDiffuse,
      normalMap: branchNormal,
      roughness: 0.78,
      metalness: 0.08,
      side: THREE.DoubleSide,
    })

    return { body, eyes, branches }
  }, [matcaps, eyeMatcap, dogNormal, branchDiffuse, branchNormal])

  /* --- assign materials by mesh role ------------------------------------- */

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return
      child.frustumCulled = false // skinned, and always on screen
      if (/eye/i.test(child.name)) child.material = materials.eyes
      else if (child.name.includes('DOG')) child.material = materials.body
      else child.material = materials.branches
    })
  }, [scene, materials])

  /* --- idle animation ----------------------------------------------------- */

  useEffect(() => {
    const action = actions['Take 001']
    if (!action) return
    action.reset().play()
    action.timeScale = 0.5 // slowed right down; restlessness reads as cheap
    return () => void action.stop()
  }, [actions])

  /* --- finish cross-fade -------------------------------------------------- */

  const fade = useRef({ t: 1, active: false })

  useEffect(() => {
    const { uniforms } = materials.body.userData
    const next = matcaps[finish]
    if (!uniforms || !next || materials.body.matcap === next) return

    uniforms.uMatcapB.value = next
    uniforms.uMix.value = 0
    fade.current = { t: 0, active: true }
  }, [finish, matcaps, materials])

  /* --- per-frame: damp toward the scroll rig ------------------------------ */

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    const dt = Math.min(delta, 1 / 30) // clamp after a tab-switch stall
    const d = (current, target, lambda) =>
      THREE.MathUtils.damp(current, target, lambda, dt)

    // Pointer parallax rides on top of the scroll target, never replaces it.
    const px = rig.pointerX * 0.22
    const py = rig.pointerY * 0.14

    g.position.x = d(g.position.x, rig.targetX + px, 3.2)
    g.position.y = d(g.position.y, rig.targetY - py, 3.2)
    g.position.z = d(g.position.z, rig.targetZ, 3.2)

    g.rotation.y = d(g.rotation.y, rig.targetRotY + rig.spin + rig.pointerX * 0.16, 2.6)
    g.rotation.z = d(g.rotation.z, rig.targetTilt, 2.6)
    g.rotation.x = d(g.rotation.x, rig.pointerY * 0.06, 2.6)

    g.scale.setScalar(d(g.scale.x, rig.targetScale, 3.2))

    // A slow float keeps the object alive when the page is still.
    g.position.y += Math.sin(state.clock.elapsedTime * 0.55) * 0.012

    // Advance the material dissolve.
    const f = fade.current
    if (f.active) {
      const u = materials.body.userData.uniforms
      f.t = Math.min(1, f.t + dt / 0.6)
      u.uMix.value = f.t * f.t * (3 - 2 * f.t) // smoothstep
      if (f.t >= 1) {
        materials.body.matcap = u.uMatcapB.value
        u.uMix.value = 0
        f.active = false
      }
    }
  })

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}
