import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { RECOGNITION } from '../lib/content'

export default function Recognition() {
  const root = useRef(null)

  /* Counters roll up once, when the row first crosses into view. */
  useEffect(() => {
    const scope = root.current
    if (!scope) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.rec__value', scope).forEach((el) => {
        const end = Number(el.dataset.value)
        if (prefersReducedMotion()) {
          el.textContent = String(end)
          return
        }
        const proxy = { v: 0 }
        gsap.to(proxy, {
          v: end,
          duration: 1.8,
          ease: 'silk',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(proxy.v))
          },
        })
      })

      /* Each award row wipes in a hairline as it arrives. */
      gsap.utils.toArray('.rec__row', scope).forEach((row) => {
        gsap.from(row.querySelector('.rec__rule'), {
          scaleX: 0,
          duration: 1.1,
          ease: 'silk',
          scrollTrigger: { trigger: row, start: 'top 90%', once: true },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="recognition" className="section rec" ref={root}>
      <div className="shell layer">
        <div className="eyebrow mono" data-reveal="fade">
          <b>{RECOGNITION.index}</b>
          <span>{RECOGNITION.label}</span>
        </div>

        <dl className="rec__counters">
          {RECOGNITION.counters.map((c) => (
            <div key={c.label}>
              <dd className="display">
                <span className="rec__value" data-value={c.value}>
                  0
                </span>
              </dd>
              <dt className="mono dim">{c.label}</dt>
            </div>
          ))}
        </dl>

        <ul className="rec__list">
          {RECOGNITION.awards.map((a, i) => (
            <li className="rec__row" key={a.title + i}>
              <span className="rec__rule" aria-hidden="true" />
              <span className="rec__year mono">{a.year}</span>
              <span className="rec__title display">{a.title}</span>
              <span className="rec__body mono dim">{a.body}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

