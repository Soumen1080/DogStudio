import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion'
import { MARQUEE } from '../lib/content'

/**
 * A ticker that always drifts, and briefly speeds up — and reverses — with the
 * scroll direction. That velocity link is what makes it feel wired into the
 * page rather than bolted on.
 */
export default function Marquee() {
  const track = useRef(null)

  useEffect(() => {
    const el = track.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      // The list is rendered twice, so wrapping at -50% is seamless.
      const tween = gsap.to(el, {
        xPercent: -50,
        repeat: -1,
        duration: 28,
        ease: 'none',
      })

      ScrollTrigger.create({
        onUpdate(self) {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 700, 7)
          tween.timeScale(self.direction * boost)
          // …then ease back to a slow drift in whichever direction we ended up.
          gsap.to(tween, { timeScale: self.direction, duration: 1, overwrite: true })
        },
      })
    })

    return () => ctx.revert()
  }, [])

  const row = MARQUEE.map((word, i) => (
    <span className="marquee__item" key={word + i}>
      <span className="display">{word}</span>
      <i className="marquee__dot" aria-hidden="true" />
    </span>
  ))

  return (
    <div className="marquee layer" aria-hidden="true">
      <div className="marquee__track" ref={track}>
        {row}
        {row}
      </div>
    </div>
  )
}
