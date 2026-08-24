import { useEffect, useRef, useState } from 'react'

import { gsap, ScrollTrigger, magnetic } from '../lib/motion'
import { getLenis, scrollTo } from '../lib/scroll'
import { NAV, STUDIO, SOCIALS } from '../lib/content'

/** Local time in the studio's timezone, updated every 30s. */
function useStudioClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: STUDIO.timezone,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function Nav() {
  const bar = useRef(null)
  const markRef = useRef(null)
  const overlay = useRef(null)
  const [open, setOpen] = useState(false)
  const time = useStudioClock()

  /* --- hide while scrolling down, reveal on the way back up -------------- */
  useEffect(() => {
    const el = bar.current
    if (!el) return

    const ctx = gsap.context(() => {
      const hide = gsap.to(el, {
        yPercent: -110,
        opacity: 0,
        duration: 0.5,
        ease: 'brass',
        paused: true,
      })

      ScrollTrigger.create({
        start: 'top -120',
        end: 'max',
        onUpdate(self) {
          if (self.direction === 1 && self.scroll() > 260) hide.play()
          else hide.reverse()
        },
        onLeaveBack: () => hide.reverse(),
      })
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => magnetic(markRef.current, 0.3), [])

  /* --- full-screen menu -------------------------------------------------- */
  useEffect(() => {
    const el = overlay.current
    if (!el) return
    const lenis = getLenis()

    const ctx = gsap.context(() => {
      if (open) {
        lenis?.stop()
        gsap.set(el, { pointerEvents: 'auto' })
        gsap
          .timeline()
          .to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'silk' })
          .from(
            '.menu__link span',
            { yPercent: 115, duration: 0.85, stagger: 0.06, ease: 'silk' },
            '-=0.5',
          )
          .from('.menu__aside > *', { opacity: 0, y: 18, stagger: 0.05 }, '-=0.6')
      } else {
        lenis?.start()
        gsap.to(el, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.7,
          ease: 'silk',
          onComplete: () => gsap.set(el, { pointerEvents: 'none' }),
        })
      }
    })
    return () => ctx.revert()
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (href) => (e) => {
    e.preventDefault()
    setOpen(false)
    // Let the curtain start lifting before the page moves underneath it.
    setTimeout(() => scrollTo(href, { duration: 1.6 }), 260)
  }

  return (
    <>
      <header className="nav" ref={bar}>
        <a
          className="nav__mark"
          href="#hero"
          ref={markRef}
          onClick={go('#hero')}
          data-cursor="link"
        >
          <span className="nav__glyph" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M12 3.4c-3.5 0-6 2.5-6 5.9 0 2 .9 3.6 2.2 5 1 1.1 1.5 2 1.6 3.3h4.4c.1-1.3.6-2.2 1.6-3.3 1.3-1.4 2.2-3 2.2-5 0-3.4-2.5-5.9-6-5.9Z"
                fill="currentColor"
              />
              <circle cx="9.6" cy="9.3" r="1.15" fill="var(--ink)" />
              <circle cx="14.4" cy="9.3" r="1.15" fill="var(--ink)" />
            </svg>
          </span>
          <span className="nav__name">{STUDIO.mark}</span>
          <sup className="mono-sm">®</sup>
        </a>

        <nav className="nav__links mono" aria-label="Primary">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={go(item.href)} data-cursor="link">
              <span>{item.label}</span>
              <span aria-hidden="true">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav__end">
          <span className="nav__clock mono-sm dim">
            {STUDIO.city} {time}
          </span>
          <button
            className={'nav__toggle mono' + (open ? ' is-open' : '')}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <span>{open ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </header>

      <div className="menu" ref={overlay}>
        <div className="menu__grid shell">
          <nav className="menu__nav" aria-label="Menu">
            {NAV.map((item, i) => (
              <a
                key={item.href}
                className="menu__link display t-lg"
                href={item.href}
                onClick={go(item.href)}
                data-cursor="link"
              >
                <em className="mono-sm">{String(i + 1).padStart(2, '0')}</em>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <aside className="menu__aside">
            <div>
              <p className="mono dim">Get in touch</p>
              <a className="menu__mail" href={`mailto:${STUDIO.email}`} data-cursor="link">
                {STUDIO.email}
              </a>
            </div>
            <div>
              <p className="mono dim">Studio</p>
              {STUDIO.address.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div>
              <p className="mono dim">Elsewhere</p>
              <ul className="menu__social">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" data-cursor="link">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
