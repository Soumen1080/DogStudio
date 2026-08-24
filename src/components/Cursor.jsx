import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

/**
 * A two-part cursor: a hard brass dot that tracks instantly, and a ring that
 * trails behind it. The ring reads the `data-cursor` attribute of whatever is
 * under the pointer, so any element can restyle the cursor without JS wiring:
 *
 *   <a data-cursor="link">      ring grows
 *   <div data-cursor="view">    ring grows and fills with the word "View"
 *   <div data-cursor="drag">    ring grows and fills with "Drag"
 */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    // Pointer-coarse devices have a real finger; a fake cursor is noise.
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return

    const dotEl = dot.current
    const ringEl = ring.current
    const labelEl = label.current
    if (!dotEl || !ringEl) return

    document.documentElement.classList.add('has-cursor')

    const dx = gsap.quickTo(dotEl, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dotEl, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ringEl, 'x', { duration: 0.55, ease: 'power3' })
    const ry = gsap.quickTo(ringEl, 'y', { duration: 0.55, ease: 'power3' })

    let visible = false

    const onMove = (e) => {
      if (!visible) {
        visible = true
        gsap.to([dotEl, ringEl], { opacity: 1, duration: 0.3 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)

      const hit = e.target.closest?.('[data-cursor], a, button')
      const mode = hit?.dataset?.cursor ?? (hit ? 'link' : null)

      if (mode !== ringEl.dataset.mode) {
        ringEl.dataset.mode = mode ?? ''
        const scale = mode === 'view' || mode === 'drag' ? 3.6 : mode ? 1.9 : 1
        gsap.to(ringEl, { scale, duration: 0.55, ease: 'silk' })
        gsap.to(dotEl, { scale: mode ? 0 : 1, duration: 0.4, ease: 'silk' })
        if (labelEl) {
          labelEl.textContent = mode === 'view' ? 'View' : mode === 'drag' ? 'Drag' : ''
          gsap.to(labelEl, {
            opacity: mode === 'view' || mode === 'drag' ? 1 : 0,
            duration: 0.3,
          })
        }
      }
    }

    const onLeave = () => {
      visible = false
      gsap.to([dotEl, ringEl], { opacity: 0, duration: 0.3 })
    }

    const onDown = () => gsap.to(ringEl, { scale: '-=0.35', duration: 0.2 })
    const onUp = () =>
      gsap.to(ringEl, {
        scale: ringEl.dataset.mode ? 1.9 : 1,
        duration: 0.35,
        ease: 'silk',
      })

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true">
        <span className="mono-sm" ref={label} />
      </div>
    </>
  )
}
