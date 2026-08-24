# Braque — design studio site

A scroll-driven studio site built around a single persistent WebGL object. React
19 + React Three Fiber for the 3D, GSAP (ScrollTrigger + SplitText) for the
motion, Lenis for smooth scrolling.

```bash
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

## Art direction

**Obsidian & Brass.** A near-black ground (`#08080A`), warm bone type
(`#EFEAE1`), and a single brass accent (`#CBA135`) that is sampled from the
model's hero matcap — so the interface and the object are literally the same
palette rather than merely coordinated.

Type is a three-family system: **Instrument Serif** for display (with brass
italics carrying the emphasis), **Inter Tight** for reading copy, **JetBrains
Mono** for micro-labels and numerals. Everything else is hairlines, whitespace,
film grain and a vignette.

## How it is put together

```
src/
  lib/
    content.js        all copy and project data — rebrand from this one file
    motion.js         GSAP setup, house eases, the [data-reveal] system
    scroll.js         Lenis wired into GSAP's ticker
    choreography.js   the 3D object's pose per section
    store.js          DOM <-> WebGL bridge
  three/
    Stage.jsx         the fixed canvas
    Dog.jsx           model, materials, per-frame damping
  components/         one file per section
  styles/
    base.css          tokens, reset, type scale
    app.css           components, in page order
```

### The scroll-driven object

The canvas is `position: fixed` and never re-mounts — the page scrolls past it.
ScrollTrigger writes **targets** into a plain mutable object (`rig`); the render
loop damps the live transform toward those targets with
`THREE.MathUtils.damp`. Driving targets instead of the model means a coarse
scroll delta or a fast flick can never make it snap, and none of it costs a
React render.

Poses are resolved in one place from raw progress values rather than by chaining
a tween per section — see the note at the top of `choreography.js` for why the
obvious approach silently breaks.

### Live material changes

`Dog.jsx` patches `MeshMatcapMaterial` via `onBeforeCompile` so it samples *two*
matcaps and mixes between them with a `uMix` uniform. Three has no built-in way
to cross-fade matcaps — swapping the texture pops. The same patch adds a
view-space rim term, which is what lifts the silhouette off a near-black page.

Selecting a finish only writes an index to the store; the DOM never touches
Three directly.

### Reveals

Markup opts in declaratively — `data-reveal="lines|words|chars|fade|stagger"`,
tuned with `data-delay` / `data-stagger` / `data-start`. Nothing is hidden in
CSS: GSAP's `.from()` applies its start values when the tween is created, so
elements hide themselves only once the animation that will reveal them exists.
If JS never runs, the page still renders in full.

Anything already on screen when reveals are wired up plays immediately rather
than waiting for a scroll — otherwise hero copy that happens to land just below
the trigger line stays invisible until you scroll, which reads as a broken page.

## Rebranding

Everything user-facing lives in `src/lib/content.js`. Change `STUDIO.name`, the
section copy, and the project list; swap the palette tokens at the top of
`src/styles/base.css`. Finishes map to matcaps in `public/matcap/` — each entry
carries a `swatch` colour sampled from its own texture.

## Notes

- Reduced-motion visitors skip the preloader, smooth scroll and every transform
  reveal, and get the page directly.
- Below 900px the pinned horizontal work rail degrades to a vertical list, and
  the object centres and retreats behind the copy.
- `three` and `gsap` are split into their own build chunks so copy edits do not
  invalidate them.
