import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { CAPABILITIES } from '../lib/content'

/**
 * Four rows. Hovering one lifts a preview that follows the pointer with a lag,
 * dims its neighbours, and pulls the row toward the reader. The preview is a
 * single shared element rather than one per row — cheaper, and the cross-fade
 * between entries comes for free.
 */
export default function Capabilities() {
  const root = useRef(null)
  const preview = useRef(null)

  useEffect(() => {
    const scope = root.current
    const art = preview.current
    if (!scope || !art || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray('.cap__row', scope)
      const img = art.querySelector('img')

      const xTo = gsap.quickTo(art, 'x', { duration: 0.9, ease: 'silk' })
      const yTo = gsap.quickTo(art, 'y', { duration: 0.9, ease: 'silk' })

      const onMove = (e) => {
        const r = scope.getBoundingClientRect()
        xTo(e.clientX - r.left)
        yTo(e.clientY - r.top)
      }

      const cleanups = rows.map((row) => {
        const enter = () => {
          img.src = row.dataset.art
          gsap.to(art, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'silk' })
          gsap.to(rows, { opacity: (i, t) => (t === row ? 1 : 0.32), duration: 0.5 })
          gsap.to(row.querySelector('.cap__title'), { x: 22, duration: 0.7, ease: 'silk' })
          gsap.to(row.querySelector('.cap__n'), { color: 'var(--brass)', duration: 0.4 })
        }
        const leave = () => {
          gsap.to(art, { autoAlpha: 0, scale: 0.94, duration: 0.5, ease: 'silk' })
          gsap.to(rows, { opacity: 1, duration: 0.5 })
          gsap.to(row.querySelector('.cap__title'), { x: 0, duration: 0.7, ease: 'silk' })
          gsap.to(row.querySelector('.cap__n'), { color: 'var(--bone-46)', duration: 0.4 })
        }
        row.addEventListener('pointerenter', enter)
        row.addEventListener('pointerleave', leave)
        return () => {
          row.removeEventListener('pointerenter', enter)
          row.removeEventListener('pointerleave', leave)
        }
      })

      scope.addEventListener('pointermove', onMove)
      cleanups.push(() => scope.removeEventListener('pointermove', onMove))

      return () => cleanups.forEach((fn) => fn())
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="capabilities" className="section cap" ref={root}>
      <div className="shell layer">
        <header className="cap__head">
          <div className="eyebrow mono" data-reveal="fade">
            <b>{CAPABILITIES.index}</b>
            <span>{CAPABILITIES.label}</span>
          </div>
          <p className="display t-lg cap__intro" data-reveal="lines">
            {CAPABILITIES.intro}
          </p>
        </header>

        <div className="cap__list">
          {CAPABILITIES.items.map((item) => (
            <article
              className="cap__row"
              key={item.n}
              data-art={item.art}
              data-cursor="view"
              data-reveal="fade"
            >
              <span className="cap__n mono">{item.n}</span>

              <h3 className="cap__title display">{item.title}</h3>

              <p className="cap__blurb">{item.blurb}</p>

              <ul className="cap__tags mono-sm">
                {item.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div className="cap__preview" ref={preview} aria-hidden="true">
        <img alt="" />
      </div>
    </section>
  )
}
