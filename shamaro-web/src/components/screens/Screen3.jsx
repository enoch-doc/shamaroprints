import { useEffect, useRef, useState } from 'react'
import { gsap }                         from 'gsap'

const WORKS = [
  {
    id:   1, cat: 'Merch',
    label: 'B Tech Bagged — White Tee',
    src:   'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=70&auto=format&fit=crop',
    spec: 'DTF Print · 180gsm Cotton',
  },
  {
    id:   2, cat: 'Jotters',
    label: 'Happy Convocation Mi Amor',
    src:   'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=70&auto=format&fit=crop',
    spec: 'Hardcover · Full Colour Print',
  },
  {
    id:   3, cat: 'Awards',
    label: 'RCF LAUTECH — Award of Honour',
    src:   'https://images.unsplash.com/photo-1531987946370-8e8e3c6b46b8?w=600&q=70&auto=format&fit=crop',
    spec: 'Mahogany Wood · Gold Engraving',
  },
  {
    id:   4, cat: 'Merch',
    label: 'Jesus Girl — White Hoodie',
    src:   'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=70&auto=format&fit=crop',
    spec: 'Embroidery · 320gsm Fleece',
  },
  {
    id:   5, cat: 'Drinkware',
    label: 'Dr. Alaba — Induction Bottles',
    src:   'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=70&auto=format&fit=crop',
    spec: 'Sublimation Print · Stainless Steel',
  },
  {
    id:   6, cat: 'Print Media',
    label: 'Hult Prize LAUTECH Backdrop',
    src:   'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&q=70&auto=format&fit=crop',
    spec: '8×4ft · 440gsm Vinyl',
  },
  {
    id:   7, cat: 'Jotters',
    label: 'Dr. Okon — Induction Jotter',
    src:   'https://images.unsplash.com/photo-1612832021455-245704c6755a?w=600&q=70&auto=format&fit=crop',
    spec: 'Spiral Bound · Gloss Laminate Cover',
  },
  {
    id:   8, cat: 'Print Media',
    label: 'UNLIMITED Conf — Volunteer Tags',
    src:   'https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&q=70&auto=format&fit=crop',
    spec: 'Die Cut · 350gsm Art Card',
  },
]

const FILTERS = ['All', 'Merch', 'Jotters', 'Awards', 'Drinkware', 'Print Media']

export default function Screen3() {
  const screenRef             = useRef(null)
  const headRef               = useRef(null)
  const [active, setActive]   = useState('All')
  const [visible, setVisible] = useState(WORKS)
  const played                = useRef(false)

  useEffect(() => {
    setVisible(
      active === 'All' ? WORKS : WORKS.filter(w => w.cat === active)
    )
  }, [active])

  useEffect(() => {
    const el = screenRef.current
    if (!el) return

    const play = () => {
      if (played.current) return
      played.current = true
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
      )
    }

    el.addEventListener('screen-enter', play)
    return () => el.removeEventListener('screen-enter', play)
  }, [])

  const scrollNext = () => {
    const container = screenRef.current?.parentElement
    container?.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <div
      ref={screenRef}
      data-screen="3"
      className="screen screen-3 w-screen h-screen dark-texture
                 flex flex-col relative overflow-hidden"
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop:  'always',
      }}
    >
      {/* Header */}
      <div
        ref={headRef}
        className="opacity-0 shrink-0
                   px-10 md:px-16 pt-24 pb-6
                   flex flex-col md:flex-row
                   md:items-end justify-between gap-4
                   border-b border-white/5"
      >
        <div>
          <p className="font-body text-[9px] tracking-[0.5em]
                        uppercase text-gold-500 mb-2
                        flex items-center gap-2">
            <span className="w-5 h-px bg-gold-600" />
            Selected Work
          </p>
          <h2
            className="font-display font-black uppercase
                       text-chalk leading-none tracking-tight"
            style={{ fontSize: 'clamp(32px,4vw,60px)' }}
          >
            Our{' '}
            <span style={{
              background:           'linear-gradient(135deg,#fdbf00,#ca7312)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
            }}>
              Craft
            </span>
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`font-body text-[9px] tracking-[0.3em]
                          uppercase px-4 py-2 border
                          transition-all duration-300
                          ${active === f
                            ? 'bg-gold-400 border-gold-400 text-ink'
                            : 'border-white/10 text-dust hover:border-gold-400/40 hover:text-chalk'
                          }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div className="flex-1 overflow-y-auto px-10 md:px-16 py-6">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
          {visible.map(item => (
            <WorkItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Next */}
      <div className="absolute bottom-8 right-10 z-10">
        <button
          onClick={scrollNext}
          className="font-body text-[9px] tracking-[0.4em]
                     uppercase text-dust hover:text-gold-400
                     transition-colors duration-300
                     flex items-center gap-2"
        >
          Next
          <span className="w-6 h-px bg-gold-600" />
        </button>
      </div>
    </div>
  )
}

function WorkItem({ item }) {
  return (
    <div className="break-inside-avoid mb-3 relative overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={item.src}
          alt={item.label}
          loading="lazy"
          className="w-full h-auto block object-cover
                     transition-transform duration-700
                     group-hover:scale-105
                     saturate-50 brightness-75
                     group-hover:saturate-100 group-hover:brightness-100"
        />
        <div className="absolute inset-0
                        bg-gradient-to-t from-black/90 via-black/10 to-transparent
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-400
                        flex flex-col justify-end p-4">
          <p className="font-body text-[8px] tracking-[0.4em]
                        uppercase text-gold-400 mb-1">
            {item.cat}
          </p>
          <p className="font-display font-bold text-chalk
                        text-sm leading-tight mb-1">
            {item.label}
          </p>
          <p className="font-body text-[9px] text-dust/80 italic">
            {item.spec}
          </p>
        </div>
      </div>
    </div>
  )
}