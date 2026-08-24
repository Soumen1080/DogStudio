/**
 * Scroll choreography for the 3D stage.
 *
 * Each section owns a pose. As a section scrolls up, the object travels from
 * the previous section's pose to this one, then holds while you read.
 *
 * Two decisions worth knowing about:
 *
 * 1. ScrollTrigger drives *targets*, not the object. The render loop damps the
 *    live transform toward those targets, so a coarse scroll delta or a fast
 *    flick can never make the model snap.
 *
 * 2. Poses are resolved in one place from raw progress values, rather than by
 *    chaining one tween per section. Chained tweens all render at progress 0 on
 *    first paint, so every one of them captures the *hero* pose as its start
 *    value, and whichever updates last each frame wins. The symptom is the
 *    object drifting to a neighbouring section's position and refusing to
 *    centre. Resolving from progress is immune to update order.
 */

import { gsap, ScrollTrigger } from './motion'
import { rig } from './store'

/*
 * Poses: x/y/z in world units, rotY/tilt in radians.
 *
 * Framed against real geometry rather than guesswork: the camera sits at
 * z = 5.2 with a 34deg vertical fov, so the visible half-width at depth z is
 * (5.2 - z) * 0.3057 * aspect. Every copy block here is left-aligned, so the
 * object lives in the right-hand third — except in Finishes, where it is the
 * subject and takes the centre.
 */
const DESKTOP = {
  hero: { x: 1.35, y: -0.3, z: 1.0, rotY: 0.72, scale: 1.3, tilt: 0 },
  manifesto: { x: 1.75, y: -0.45, z: -0.7, rotY: -0.5, scale: 1.05, tilt: 0.04 },
  capabilities: { x: 2.15, y: -0.3, z: -0.8, rotY: -0.75, scale: 0.95, tilt: -0.03 },
  work: { x: 1.9, y: 0.5, z: -2.6, rotY: 0.9, scale: 0.85, tilt: 0 },
  finishes: { x: -0.28, y: -0.5, z: 0.55, rotY: 0.5, scale: 1.2, tilt: 0 },
  recognition: { x: 2.2, y: -0.45, z: -1.0, rotY: 1.9, scale: 0.9, tilt: 0.05 },
  contact: { x: 1.1, y: -0.75, z: -0.55, rotY: -0.35, scale: 1.05, tilt: -0.04 },
}

/* Narrow screens have no right-hand third to spare: the object centres,
   retreats behind the copy, and shrinks. */
const MOBILE = {
  hero: { x: 0.15, y: 0.68, z: -0.6, rotY: 0.7, scale: 0.82, tilt: 0 },
  manifesto: { x: 0.4, y: -0.4, z: -1.9, rotY: -0.45, scale: 0.8, tilt: 0.04 },
  capabilities: { x: 0.45, y: -0.3, z: -2.0, rotY: -0.7, scale: 0.75, tilt: -0.03 },
  work: { x: 0.3, y: 0.95, z: -3.6, rotY: 0.9, scale: 0.7, tilt: 0 },
  finishes: { x: 0, y: -0.35, z: -0.7, rotY: 0.55, scale: 1.0, tilt: 0 },
  recognition: { x: -0.35, y: -0.4, z: -2.1, rotY: 1.9, scale: 0.75, tilt: 0.05 },
  contact: { x: 0.3, y: -0.6, z: -1.9, rotY: -0.35, scale: 0.85, tilt: -0.04 },
}

/** How present the stage is behind each section — dense copy gets a quieter
    object, Finishes gets it at full strength. */
const STAGE_OPACITY = {
  hero: 1,
  manifesto: 0.8,
  capabilities: 0.5,
  work: 0.4,
  finishes: 1,
  recognition: 0.45,
  contact: 0.8,
}

const ORDER = [
  'hero',
  'manifesto',
  'capabilities',
  'work',
  'finishes',
  'recognition',
  'contact',
]

const lerp = (a, b, t) => a + (b - a) * t

export function initChoreography() {
  const mm = gsap.matchMedia()
  const stage = document.querySelector('.stage')

  const build = (poses) => {
    /* progress[i] = how far the transition *into* section i has run, 0..1. */
    const progress = ORDER.map(() => 0)

    const resolve = () => {
      // The live transition is the last one that has started at all.
      let i = 0
      for (let k = 1; k < ORDER.length; k++) if (progress[k] > 0) i = k

      const to = poses[ORDER[i]]
      const from = i === 0 ? to : poses[ORDER[i - 1]]
      const t = i === 0 ? 1 : progress[i]

      rig.targetX = lerp(from.x, to.x, t)
      rig.targetY = lerp(from.y, to.y, t)
      rig.targetZ = lerp(from.z, to.z, t)
      rig.targetRotY = lerp(from.rotY, to.rotY, t)
      rig.targetScale = lerp(from.scale, to.scale, t)
      rig.targetTilt = lerp(from.tilt, to.tilt, t)

      if (stage) {
        const a = STAGE_OPACITY[ORDER[i === 0 ? 0 : i - 1]]
        stage.style.opacity = String(lerp(a, STAGE_OPACITY[ORDER[i]], t))
      }
    }

    ORDER.forEach((id, i) => {
      if (i === 0) return
      const el = document.getElementById(id)
      if (!el) return

      const track = (self) => {
        progress[i] = self.progress
        resolve()
      }

      ScrollTrigger.create({
        trigger: el,
        // Arrive while the section is coming up, then hold. Carrying the
        // transition all the way in meant a short section handed the object to
        // the next pose before you had finished reading it.
        start: 'top 80%',
        end: 'top 30%',
        scrub: true,
        onUpdate: track,
        onRefresh: track,
      })
    })

    resolve()

    /* Finishes adds a slow turntable so a material change is readable from
       more than one angle. Kept deliberately shallow: the model's own idle
       animation already swings the silhouette, and a wider arc on top of it
       swings the head out of frame. */
    const finishes = document.getElementById('finishes')
    if (finishes) {
      gsap.fromTo(
        rig,
        { spin: -0.28 },
        {
          spin: 0.28,
          ease: 'none',
          scrollTrigger: {
            trigger: finishes,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        },
      )
    }
  }

  mm.add('(min-width: 901px)', () => build(DESKTOP))
  mm.add('(max-width: 900px)', () => build(MOBILE))

  return () => {
    mm.revert()
    rig.spin = 0
    if (stage) stage.style.removeProperty('opacity')
  }
}
