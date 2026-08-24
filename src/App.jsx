import { useCallback, useEffect, useRef, useState } from 'react'

import { gsap, ScrollTrigger, initReveals, prefersReducedMotion } from './lib/motion'
import { useSmoothScroll, useAnchorScroll } from './lib/scroll'
import { initChoreography } from './lib/choreography'
import { store } from './lib/store'

import Stage from './three/Stage'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Manifesto from './components/Manifesto'
import Capabilities from './components/Capabilities'
import Work from './components/Work'
import Finishes from './components/Finishes'
import Recognition from './components/Recognition'
import Contact from './components/Contact'

import 'lenis/dist/lenis.css'
import './styles/base.css'
import './styles/app.css'

/** Thin brass rail down the right edge, standing in for the hidden scrollbar. */
function ScrollRail() {
  const fill = useRef(null)

  useEffect(() => {
    const el = fill.current
    if (!el) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          el.style.transform = `scaleY(${self.progress})`
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="rail" aria-hidden="true">
      <span ref={fill} />
    </div>
  )
}

export default function App() {
  /* Reduced motion never sees a preloader — it starts ready, so the scroll
     wiring is built on the first commit instead of after a curtain. */
  const [reduced] = useState(prefersReducedMotion)
  const [ready, setReady] = useState(reduced)
  const root = useRef(null)

  useSmoothScroll()
  useAnchorScroll()

  const onLoaded = useCallback(() => {
    store.set({ ready: true })
    setReady(true)
  }, [])

  /* Everything scroll-driven is built in one place, once the curtain is up.
     Wiring it earlier would measure a page that is still behind the preloader
     — and would start hero animations nobody can see. */
  useEffect(() => {
    if (!ready) return

    const ctx = gsap.context(() => {
      initReveals(root.current)
    }, root)

    const disposeChoreography = initChoreography()

    // Late-loading covers change the horizontal track's width, so remeasure.
    const onImg = () => ScrollTrigger.refresh()
    const imgs = Array.from(root.current?.querySelectorAll('img') ?? [])
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', onImg, { once: true })
    })

    ScrollTrigger.refresh()

    return () => {
      imgs.forEach((img) => img.removeEventListener('load', onImg))
      disposeChoreography()
      ctx.revert()
    }
  }, [ready])

  return (
    <div className="app" ref={root}>
      <Stage />

      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <Cursor />
      <ScrollRail />
      <Nav />

      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Capabilities />
        <Work />
        <Finishes />
        <Recognition />
        <Contact />
      </main>

      {!reduced && <Preloader onDone={onLoaded} />}
    </div>
  )
}
