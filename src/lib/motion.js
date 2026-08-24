/**
 * Central GSAP configuration: plugin registration, house eases, and the
 * declarative reveal system that every section opts into with `data-reveal`.
 *
 * Importing this module has the side effect of registering plugins, so it must
 * be imported once, early (App does it).
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

/* House eases -------------------------------------------------------------- */

/** Long, expensive-feeling settle. The signature ease of the site. */
CustomEase.create('silk', '0.16, 1, 0.3, 1')
/** Slight anticipation then a firm arrival — used for UI chrome. */
CustomEase.create('brass', '0.62, 0.05, 0.01, 0.99')

gsap.defaults({ ease: 'silk', duration: 1 })

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* -------------------------------------------------------------------------- */
/* Reveal system                                                              */
/* -------------------------------------------------------------------------- */
/*
 * Markup opts in declaratively:
 *
 *   <h2 data-reveal="lines">…</h2>        line-by-line mask wipe
 *   <p  data-reveal="words">…</p>         word-by-word opacity (long copy)
 *   <div data-reveal="fade">…</div>       rise + fade
 *   <div data-reveal="stagger">…</div>    children rise + fade in sequence
 *   <span data-reveal="chars">…</span>    character cascade (short labels)
 *
 * Optional tuning: data-delay="0.2" data-stagger="0.08" data-start="top 80%"
 */

const startOf = (el) => el.dataset.start || 'top 82%'
const numOf = (el, key, fallback) =>
  el.dataset[key] !== undefined ? parseFloat(el.dataset[key]) : fallback

/**
 * Anything already on screen when the reveals are wired up belongs to the
 * intro, not to scrolling — it must animate straight away.
 *
 * Without this, hero copy that happens to sit below the trigger line (the
 * standfirst lands at 82.1% of the viewport on a laptop) would stay invisible
 * until the visitor scrolled, which reads as a broken page.
 */
const onScreen = (el) => {
  const r = el.getBoundingClientRect()
  return r.top < window.innerHeight && r.bottom > 0
}

/** ScrollTrigger config, or undefined for above-the-fold elements. */
const triggerFor = (el) =>
  onScreen(el) ? undefined : { trigger: el, start: startOf(el), once: true }

/**
 * Wire up every [data-reveal] inside `scope`.
 * Returns nothing — cleanup is handled by the caller's gsap.context().
 */
export function initReveals(scope) {
  const reduced = prefersReducedMotion()

  gsap.utils.toArray('[data-reveal]', scope).forEach((el) => {
    const kind = el.dataset.reveal
    const delay = numOf(el, 'delay', 0)

    // Reduced motion: leave the element exactly as authored.
    if (reduced) return

    switch (kind) {
      /* ------------------------------------------------ headline line wipe */
      case 'lines': {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'r-line',
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 115,
              opacity: 0,
              duration: 1.25,
              delay,
              stagger: numOf(el, 'stagger', 0.09),
              ease: 'silk',
              scrollTrigger: triggerFor(el),
            })
          },
        })
        break
      }

      /* ---------------------------------------- long copy, word by word fade */
      case 'words': {
        SplitText.create(el, {
          type: 'words',
          wordsClass: 'r-word',
          autoSplit: true,
          onSplit(self) {
            return gsap.fromTo(
              self.words,
              { opacity: 0.13, filter: 'blur(2px)' },
              {
                opacity: 1,
                filter: 'blur(0px)',
                ease: 'none',
                stagger: 0.35,
                scrollTrigger: {
                  trigger: el,
                  start: 'top 78%',
                  end: 'bottom 58%',
                  scrub: 0.6,
                },
              },
            )
          },
        })
        break
      }

      /* --------------------------------------------------- character cascade */
      case 'chars': {
        SplitText.create(el, {
          type: 'chars',
          charsClass: 'r-char',
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.chars, {
              yPercent: 90,
              opacity: 0,
              duration: 0.9,
              delay,
              stagger: numOf(el, 'stagger', 0.022),
              ease: 'silk',
              scrollTrigger: triggerFor(el),
            })
          },
        })
        break
      }

      /* ------------------------------------------------ children, in sequence */
      case 'stagger': {
        const kids = gsap.utils.toArray(':scope > *', el)
        gsap.from(kids, {
          y: 34,
          opacity: 0,
          duration: 1.1,
          delay,
          stagger: numOf(el, 'stagger', 0.08),
          scrollTrigger: triggerFor(el),
        })
        break
      }

      /* --------------------------------------------------------- simple rise */
      default: {
        gsap.from(el, {
          y: numOf(el, 'y', 26),
          opacity: 0,
          duration: 1.1,
          delay,
          scrollTrigger: triggerFor(el),
        })
      }
    }
  })
}

/* -------------------------------------------------------------------------- */
/* Magnetic pointer attraction — used on buttons and the wordmark             */
/* -------------------------------------------------------------------------- */

export function magnetic(el, strength = 0.35) {
  if (!el || prefersReducedMotion()) return () => {}

  const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'silk' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'silk' })

  const move = (e) => {
    const r = el.getBoundingClientRect()
    xTo((e.clientX - (r.left + r.width / 2)) * strength)
    yTo((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => {
    xTo(0)
    yTo(0)
  }

  el.addEventListener('pointermove', move)
  el.addEventListener('pointerleave', leave)
  return () => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerleave', leave)
    gsap.set(el, { x: 0, y: 0 })
  }
}

export { gsap, ScrollTrigger, SplitText }
