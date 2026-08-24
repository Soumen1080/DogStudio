import { MANIFESTO } from '../lib/content'

export default function Manifesto() {
  return (
    <section id="manifesto" className="section manifesto">
      <div className="shell layer">
        <div className="eyebrow mono" data-reveal="fade">
          <b>{MANIFESTO.index}</b>
          <span>{MANIFESTO.label}</span>
        </div>

        {/* Word-by-word scrub: the paragraph literally reads itself as you
            scroll, which is the one place a long block of copy earns its keep. */}
        <p className="manifesto__body display t-lg" data-reveal="words">
          {MANIFESTO.body}
        </p>

        <div className="manifesto__foot">
          <p className="mono dim" data-reveal="fade">
            {MANIFESTO.signature}
          </p>

          <dl className="manifesto__stats" data-reveal="stagger">
            {MANIFESTO.stats.map(([label, value]) => (
              <div key={label}>
                <dd className="display">{value}</dd>
                <dt className="mono dim">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
