import { useEffect, useRef } from 'react'
import { gsap, magnetic } from '../lib/motion'
import { CONTACT, STUDIO, SOCIALS } from '../lib/content'

export default function Contact() {
  const mail = useRef(null)
  const root = useRef(null)

  useEffect(() => magnetic(mail.current, 0.45), [])

  /* A brass wash rises behind the closing statement as it settles. */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact__glow',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  const year = new Date().getFullYear()

  return (
    <section id="contact" className="section contact" ref={root}>
      <div className="contact__glow" aria-hidden="true" />

      <div className="shell layer">
        <div className="eyebrow mono" data-reveal="fade">
          <b>{CONTACT.index}</b>
          <span>{CONTACT.label}</span>
        </div>

        <h2
          className="display t-xl contact__title"
          data-reveal="lines"
          dangerouslySetInnerHTML={{ __html: CONTACT.headline }}
        />

        <div className="contact__row">
          <p className="t-body" data-reveal="lines" data-delay="0.1">
            {CONTACT.body}
          </p>

          <a
            className="btn btn--lg"
            href={`mailto:${STUDIO.email}`}
            ref={mail}
            data-reveal="fade"
            data-delay="0.2"
            data-cursor="link"
          >
            <span className="btn__label">
              <span>{STUDIO.email}</span>
              <span aria-hidden="true">{STUDIO.email}</span>
            </span>
            <span className="btn__arrow" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="14" height="14">
                <path d="M3 13 13 3M6 3h7v7" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
          </a>
        </div>

        <div className="contact__status mono" data-reveal="fade">
          <i aria-hidden="true" />
          {CONTACT.availability}
        </div>

        <footer className="foot">
          <div className="foot__col">
            <p className="mono dim">Studio</p>
            {STUDIO.address.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>{STUDIO.phone}</p>
          </div>

          <div className="foot__col">
            <p className="mono dim">Elsewhere</p>
            <ul>
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    className="link-underline"
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot__col foot__col--end">
            <p className="mono dim">Colophon</p>
            <p>Inter Tight · Instrument Serif · JetBrains Mono</p>
            <p className="dim">React · Three.js · GSAP · Lenis</p>
          </div>

          <div className="foot__bar mono-sm">
            <span>
              © {year} {STUDIO.name}
            </span>
            <span className="dim">All rights reserved</span>
            <a href="#hero" data-cursor="link">
              Back to top ↑
            </a>
          </div>
        </footer>
      </div>
    </section>
  )
}
