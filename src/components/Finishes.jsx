import { useEffect, useRef } from 'react'
import { gsap } from '../lib/motion'
import { FINISHES } from '../lib/content'
import { store, useStore } from '../lib/store'

/**
 * The one section where the 3D object stops being decoration.
 *
 * Selecting a finish writes to the shared store; the WebGL layer picks it up
 * and dissolves between two matcaps on the GPU. The DOM here only ever sets an
 * index — it never touches Three directly, which keeps the two layers
 * swappable.
 */
export default function Finishes() {
  const active = useStore((s) => s.finish)
  const list = useRef(null)
  const readout = useRef(null)

  const select = (i) => store.set({ finish: i })

  /* Slide the brass indicator to whichever chip is live. */
  useEffect(() => {
    const scope = list.current
    if (!scope) return
    const chip = scope.querySelector(`[data-index="${active}"]`)
    const rail = scope.querySelector('.fin__indicator')
    if (!chip || !rail) return

    gsap.to(rail, {
      x: chip.offsetLeft,
      y: chip.offsetTop,
      width: chip.offsetWidth,
      height: chip.offsetHeight,
      duration: 0.65,
      ease: 'brass',
    })
  }, [active])

  /* Swap the spec line with a quick vertical wipe rather than a hard cut. */
  useEffect(() => {
    const el = readout.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.children,
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'silk' },
      )
    }, readout)
    return () => ctx.revert()
  }, [active])

  const current = FINISHES.items[active]

  return (
    <section id="finishes" className="section fin">
      <div className="shell layer">
        <div className="eyebrow mono" data-reveal="fade">
          <b>{FINISHES.index}</b>
          <span>{FINISHES.label}</span>
        </div>

        <div className="fin__grid">
          <div className="fin__copy">
            <h2 className="display t-xl" data-reveal="lines">
              {FINISHES.title}
            </h2>
            <p className="t-body" data-reveal="lines" data-delay="0.15">
              {FINISHES.body}
            </p>
          </div>

          <div className="fin__panel" data-reveal="fade" data-delay="0.2">
            <div className="fin__readout" ref={readout}>
              <p className="fin__name display">{current.name}</p>
              <p className="mono dim">{current.spec}</p>
            </div>

            <div className="fin__chips" ref={list} role="radiogroup" aria-label="Surface finish">
              <span className="fin__indicator" aria-hidden="true" />
              {FINISHES.items.map((f, i) => (
                <button
                  key={f.id}
                  className={'fin__chip' + (i === active ? ' is-active' : '')}
                  data-index={i}
                  role="radio"
                  aria-checked={i === active}
                  aria-label={f.name}
                  onClick={() => select(i)}
                  onPointerEnter={() => select(i)}
                  data-cursor="link"
                >
                  <span className="fin__swatch" style={{ background: f.swatch }} />
                  <span className="fin__label mono-sm">{f.name}</span>
                </button>
              ))}
            </div>

            <p className="fin__note mono-sm dim">
              Rendered live · matcap shading · zero draw-call cost
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
