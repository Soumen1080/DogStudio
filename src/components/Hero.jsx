import { useEffect, useRef } from 'react'
import { gsap, magnetic } from '../lib/motion'
import { HERO, STUDIO } from '../lib/content'

export default function Hero() {
  const cta = useRef(null)
  const section = useRef(null)

  useEffect(() => magnetic(cta.current, 0.4), [])

  /* The hero copy drifts up faster than the page scrolls, so the 3D object
     appears to hold its ground as the type leaves. */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero__inner', {
        yPercent: -14,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" className="hero" ref={section}>
      <div className="shell hero__inner layer">
        <div className="hero__top">
          {HERO.eyebrow.map((line, i) => (
            <span className="mono dim" key={line} data-reveal="fade" data-delay={0.1 + i * 0.08}>
              {line}
            </span>
          ))}
          <span className="mono brass" data-reveal="fade" data-delay={0.26}>
            {STUDIO.since}
          </span>
        </div>

        <h1
          className="display t-hero hero__title"
          data-reveal="lines"
          data-delay="0.15"
          data-stagger="0.1"
          dangerouslySetInnerHTML={{ __html: HERO.headline }}
        />

        <div className="hero__foot">
          <p className="t-body" data-reveal="lines" data-delay="0.5" data-stagger="0.05">
            {HERO.standfirst}
          </p>

          <div className="hero__side">
            <dl className="hero__meta mono" data-reveal="stagger" data-delay="0.6">
              {HERO.meta.map(([k, v]) => (
                <div key={k}>
                  <dt className="dim">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>

            <a
              className="btn"
              href={HERO.cta.href}
              ref={cta}
              data-reveal="fade"
              data-delay="0.75"
              data-cursor="link"
            >
              <span className="btn__label">
                <span>{HERO.cta.label}</span>
                <span aria-hidden="true">{HERO.cta.label}</span>
              </span>
              <span className="btn__arrow" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="13" height="13">
                  <path
                    d="M3 13 13 3M6 3h7v7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      <a className="cue mono-sm" href="#manifesto" data-cursor="link" aria-label="Scroll down">
        <span>Scroll</span>
        <i aria-hidden="true" />
      </a>
    </section>
  )
}

