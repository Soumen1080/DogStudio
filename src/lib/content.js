/**
 * All site copy lives here so the whole studio can be re-branded from one file.
 * Change STUDIO and the sections below - no component edits required.
 */

export const STUDIO = {
  name: 'Braque',
  mark: 'Braque',
  legal: '© ' + new Date().getFullYear() + ' Braque Studio',
  tagline: 'Independent design studio',
  since: 'Est. 2016',
  city: 'Brussels',
  timezone: 'Europe/Brussels',
  email: 'hello@braque.studio',
  phone: '+32 2 588 04 12',
  address: ['Rue des Chartreux 27', '1000 Brussels, BE'],
}

export const NAV = [
  { label: 'Studio', href: '#manifesto' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Work', href: '#work' },
  { label: 'Finishes', href: '#finishes' },
  { label: 'Contact', href: '#contact' },
]

export const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Behance', href: 'https://behance.net' },
  { label: 'Dribbble', href: 'https://dribbble.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
]

export const HERO = {
  eyebrow: ['Independent design studio', 'Brussels — Worldwide'],
  headline: 'We shape ideas into <em>objects of desire</em>',
  standfirst:
    'Braque is a small studio of designers, animators and engineers. We build brand systems and real-time experiences for companies that would rather be remembered than merely seen.',
  cta: { label: 'Start a project', href: '#contact' },
  meta: [
    ['Founded', '2016'],
    ['Team', '11 people'],
    ['Awards', '24'],
  ],
}

export const MARQUEE = [
  'Brand Identity',
  'Art Direction',
  'Real-time 3D',
  'Motion',
  'Digital Product',
  'Creative Technology',
]

export const MANIFESTO = {
  index: '01',
  label: 'Manifesto',
  body: 'Most work disappears the moment it ships. We are interested in the other kind — the work that earns a second look, then a third. That means fewer projects, longer thinking, and an obsessive relationship with craft. We treat a website like a physical object: it should have weight, material, and a surface worth touching.',
  signature: 'Camille Roussel — Founder & Creative Director',
  stats: [
    ['Projects shipped', '148'],
    ['Countries', '19'],
    ['Avg. engagement', '14 wks'],
  ],
}

export const CAPABILITIES = {
  index: '02',
  label: 'Capabilities',
  intro: 'Four disciplines, one team, no handoffs.',
  items: [
    {
      n: '01',
      title: 'Brand Systems',
      blurb:
        'Naming, identity, typography and the rules that keep it coherent when we are no longer in the room.',
      tags: ['Positioning', 'Identity', 'Guidelines', 'Naming'],
      art: '/opera.png',
    },
    {
      n: '02',
      title: 'Digital Design',
      blurb:
        'Sites and products designed in the browser, prototyped early, and built to feel inevitable.',
      tags: ['UX', 'UI', 'Design systems', 'Prototyping'],
      art: '/kikk.png',
    },
    {
      n: '03',
      title: 'Real-time 3D',
      blurb:
        'WebGL scenes, configurators and interactive film — rendered live, at sixty frames, on the device in your hand.',
      tags: ['WebGL', 'Shaders', 'Configurators', 'AR'],
      art: '/tommorowland.png',
    },
    {
      n: '04',
      title: 'Motion & Film',
      blurb:
        'Title sequences, product film and the choreography that ties a whole system together.',
      tags: ['Direction', 'Animation', 'Sound', 'Post'],
      art: '/navy-pier.png',
    },
  ],
}

export const WORK = {
  index: '03',
  label: 'Selected work',
  intro: 'Six of the last thirty. The rest on request.',
  projects: [
    { n: '01', title: 'KIKK Festival', client: 'KIKK', year: '2024', scope: 'Identity · Site · Motion', art: '/kikk.png', accent: '#CBA135' },
    { n: '02', title: 'Tomorrowland', client: 'Tomorrowland', year: '2024', scope: 'Real-time 3D · Film', art: '/tommorowland.png', accent: '#E5A24B' },
    { n: '03', title: 'Opera House', client: 'La Monnaie', year: '2023', scope: 'Brand system · Digital', art: '/opera.png', accent: '#C97F6B' },
    { n: '04', title: 'Navy Pier', client: 'Navy Pier Inc.', year: '2023', scope: 'Experience · Wayfinding', art: '/navy-pier.png', accent: '#5E9FA8' },
    { n: '05', title: 'Kennedy Center', client: 'The Kennedy Center', year: '2022', scope: 'Installation · Product', art: '/kennedy.png', accent: '#9C8FD1' },
    { n: '06', title: 'Museum of Science', client: 'MSI Chicago', year: '2022', scope: 'Exhibit · Interactive', art: '/msi-chicago.png', accent: '#B8B4AC' },
  ],
}

/**
 * Finishes - each maps to a matcap in /public/matcap.
 * `swatch` is the UI chip colour, sampled from the matcap texture itself.
 */
export const FINISHES = {
  index: '04',
  label: 'The material',
  title: 'Every surface is a decision',
  body: 'Our mascot is modelled once and finished six ways — the same geometry, a different intention. Pick one and watch it change, live, at sixty frames per second.',
  items: [
    { id: 'brass', name: 'Polished Brass', spec: 'Matcap 19 · warm specular', map: '/matcap/mat-19.png', swatch: '#C49429' },
    { id: 'bronze', name: 'Antique Bronze', spec: 'Matcap 13 · low sheen', map: '/matcap/mat-13.png', swatch: '#70603D' },
    { id: 'platinum', name: 'Platinum', spec: 'Matcap 05 · neutral chrome', map: '/matcap/mat-5.png', swatch: '#CCCDD0' },
    { id: 'obsidian', name: 'Obsidian', spec: 'Matcap 06 · deep gloss', map: '/matcap/mat-6.png', swatch: '#3A3B40' },
    { id: 'patina', name: 'Oxidised Copper', spec: 'Matcap 08 · verdigris', map: '/matcap/mat-8.png', swatch: '#338896' },
    { id: 'vermilion', name: 'Vermilion Lacquer', spec: 'Matcap 03 · high key', map: '/matcap/mat-3.png', swatch: '#EA594F' },
  ],
}

export const RECOGNITION = {
  index: '05',
  label: 'Recognition',
  counters: [
    { value: 24, label: 'Awards' },
    { value: 9, label: 'Years' },
    { value: 148, label: 'Projects' },
    { value: 19, label: 'Countries' },
  ],
  awards: [
    { year: '2025', title: 'Site of the Year', body: 'Awwwards' },
    { year: '2024', title: 'Grand Prix — Digital Craft', body: 'Cannes Lions' },
    { year: '2024', title: 'Interactive of the Year', body: 'FWA' },
    { year: '2023', title: 'Best Use of WebGL', body: 'Webby Awards' },
    { year: '2022', title: 'Design Team of the Year', body: 'D&AD' },
  ],
}

export const CONTACT = {
  index: '06',
  label: 'Contact',
  headline: 'Let us make something <em>worth keeping</em>',
  body: 'We take on eight projects a year. Tell us what you are building and we will tell you honestly whether we are the right studio for it.',
  availability: 'Booking Q2 2026',
}
