/**
 * A ~40-line external store that bridges the DOM layer and the WebGL layer.
 *
 * Two deliberately different channels:
 *
 *   `store`  — React-visible state (which finish is selected, is the scene
 *              ready). Components subscribe with useStore() and re-render.
 *
 *   `rig`    — a plain mutable object written by ScrollTrigger every frame and
 *              read inside useFrame. It never triggers a React render, which is
 *              what keeps scroll-linked 3D at 60fps.
 */

import { useSyncExternalStore } from 'react'

const state = {
  finish: 0,      // index into FINISHES.items
  ready: false,   // preloader finished
  progress: 0,    // asset load progress, 0..1
}

const listeners = new Set()

export const store = {
  get: () => state,
  set(patch) {
    let changed = false
    for (const k in patch) {
      if (state[k] !== patch[k]) {
        state[k] = patch[k]
        changed = true
      }
    }
    if (changed) listeners.forEach((fn) => fn())
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}

/** Subscribe a component to one slice of the store. */
export function useStore(selector) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(state),
    () => selector(state),
  )
}

/**
 * Scroll-driven transform targets for the 3D rig.
 * ScrollTrigger writes `target*`; useFrame damps the live values toward them,
 * so even a coarse scroll event produces silky motion.
 */
export const rig = {
  targetX: 0,
  targetY: 0,
  targetZ: 0,
  targetRotY: 0,
  targetScale: 1,
  targetTilt: 0,

  /** normalised pointer, -1..1, updated on pointermove */
  pointerX: 0,
  pointerY: 0,

  /** 0..1 across the whole document, for ambient effects */
  scroll: 0,

  /** extra spin added while the Finishes section is on screen */
  spin: 0,
}
