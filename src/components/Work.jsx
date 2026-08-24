import { useEffect, useRef } from 'react'
import { gsap } from '../lib/motion'
import { WORK } from '../lib/content'

/**
 * Selected work, pinned and scrolled sideways.
 *
 * The section pins for exactly the distance the track has to travel, so the
 * vertical wheel gesture maps 1:1 to horizontal movement with no dead zone at
 * either end. Below 900px it degrades to an ordinary vertical list — a pinned
 * horizontal rail on a phone is a usability trap, not a flourish.
 */
export default function Work() {
  const section = useRef(null)
  const track = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 901px)', () => {
      const el = track.current
      const wrap = section.current
      if (!el || !wrap) return

      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth)

      const scroll = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => '+=' + distance(),
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      // Each cover drifts inside its frame as the card crosses the viewport —
      // a small amount of parallax reads as depth without wobbling.
      gsap.utils.toArray('.card', el).forEach((card) => {
        gsap.fromTo(
          card.querySelector('.card__art'),
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scroll,
              start: 'left right',
              end: 'right left',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="work" className="work" ref={section}>
      <div className="work__viewport layer">
        <div className="work__track" ref={track}>
          <header className="work__intro">
            <div className="eyebrow mono" data-reveal="fade">
              <b>{WORK.index}</b>
              <span>{WORK.label}</span>
            </div>
            <h2 className="display t-xl" data-reveal="lines">
              {WORK.intro}
            </h2>
            <p className="mono dim work__hint">
              <i aria-hidden="true" />
              Scroll to explore
            </p>
          </header>

          {WORK.projects.map((p) => (
            <article
              className="card"
              key={p.n}
              data-cursor="view"
              style={{ '--accent': p.accent }}
            >
              <div className="card__frame">
                <img className="card__art" src={p.art} alt={p.title} loading="lazy" />
                <span className="card__n mono-sm">{p.n}</span>
              </div>
              <div className="card__meta">
                <h3 className="display">{p.title}</h3>
                <p className="mono dim">{p.scope}</p>
                <p className="mono card__year">
                  <span>{p.client}</span>
                  <span>{p.year}</span>
                </p>
              </div>
            </article>
          ))}

          <div className="work__end">
            <p className="display t-lg">
              And thirty
              <br />
              more.
            </p>
            <a className="link-underline mono" href="#contact" data-cursor="link">
              Request the full index
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

