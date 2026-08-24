/**
 * Smooth scrolling — Lenis driving GSAP's ticker, with ScrollTrigger kept in
 * sync. Using one ticker (GSAP's) for both means scroll position and animation
 * playhead are updated in the same frame, which removes the sub-frame jitter
 * you get when Lenis runs its own rAF loop.
 */

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion'
import { rig } from './store'

let lenis = null

/** Programmatic scrolling that respects the smooth-scroll easing. */
export function scrollTo(target, opts = {}) {
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.5, ...opts })
  else if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }
}

export const getLenis = () => lenis

export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    lenis = new Lenis({
      // A long duration with an exponential-out easing gives the heavy,
      // "expensive" glide rather than the floaty default.
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      // Touch devices keep native inertia; smoothing it fights the OS.
      syncTouch: false,
    })

    const onScroll = ({ scroll, limit }) => {
      rig.scroll = limit > 0 ? scroll / limit : 0
      ScrollTrigger.update()
    }
    lenis.on('scroll', onScroll)

    const raf = (time) => lenis?.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis?.destroy()
      lenis = null
    }
  }, [])
}

/**
 * Delegated handler for in-page anchors so every `href="#id"` in the markup
 * routes through Lenis instead of jumping.
 */
export function useAnchorScroll() {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (!id || id === '#') return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      scrollTo(el)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
