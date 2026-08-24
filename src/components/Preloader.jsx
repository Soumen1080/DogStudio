import { useEffect, useRef } from 'react'
import { useProgress } from '@react-three/drei'

import { gsap } from '../lib/motion'
import { STUDIO } from '../lib/content'

/**
 * The first four seconds of a studio site are the pitch. This one reports
 * honest progress (drei's loader store), waits for webfonts so nothing reflows
 * behind the curtain, then wipes away and hands control to the hero intro.
 */
export default function Preloader({ onDone }) {
  const root = useRef(null)
  const counter = useRef(null)
  const bar = useRef(null)
  const done = useRef(false)

  const { progress, total, loaded } = useProgress()

  /* Keep the displayed number in a ref-driven tween rather than React state:
     100 re-renders during load would be 100 chances to drop a frame. */
  const shown = useRef({ v: 0 })

  useEffect(() => {
    const assetsDone = total > 0 && loaded >= total
    const target = assetsDone ? 100 : Math.min(progress, 96)

    gsap.to(shown.current, {
      v: target,
      duration: 0.8,
      ease: 'none',
      onUpdate() {
        const v = Math.round(shown.current.v)
        if (counter.current) counter.current.textContent = String(v).padStart(3, '0')
        if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`
      },
    })
  }, [progress, total, loaded])

  /* Exit sequence -------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false

    const finish = async () => {
      // Fonts must be resolved before the hero splits into lines, or the
      // measurement is taken against the fallback face.
      await document.fonts.ready
      // Give the counter a beat to actually reach 100.
      await gsap.to(shown.current, {
        v: 100,
        duration: 0.45,
        ease: 'silk',
        onUpdate() {
          const v = Math.round(shown.current.v)
          if (counter.current) counter.current.textContent = String(v).padStart(3, '0')
          if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`
        },
      })
      if (cancelled || done.current) return
      done.current = true

      const tl = gsap.timeline({
        onComplete: () => {
          root.current?.style.setProperty('display', 'none')
          onDone?.()
        },
      })

      tl.to('.pre__row > *', {
        yPercent: -110,
        duration: 0.9,
        stagger: 0.05,
        ease: 'silk',
      })
        .to('.pre__bar', { opacity: 0, duration: 0.4 }, '-=0.6')
        .to(
          root.current,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 1.1,
            ease: 'silk',
          },
          '-=0.5',
        )
    }

    // Bail out after 9s even if an asset never resolves — a stuck preloader is
    // worse than a slightly early reveal.
    const guard = setTimeout(finish, 9000)

    if (total > 0 && loaded >= total) finish()

    return () => {
      cancelled = true
      clearTimeout(guard)
    }
  }, [total, loaded, onDone])

  return (
    <div className="pre" ref={root}>
      <div className="pre__inner">
        <div className="pre__row">
          <span className="pre__mark display">{STUDIO.mark}</span>
        </div>
        <div className="pre__row pre__meta mono">
          <span>{STUDIO.tagline}</span>
          <span>{STUDIO.city}</span>
        </div>
      </div>

      <div className="pre__count mono">
        <span ref={counter}>000</span>
        <i>/100</i>
      </div>

      <div className="pre__bar">
        <span ref={bar} />
      </div>
    </div>
  )
}
