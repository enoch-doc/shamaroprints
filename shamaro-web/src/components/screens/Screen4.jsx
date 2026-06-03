import { useEffect, useRef, useState } from 'react'
import { gsap }                         from 'gsap'
import { motion, AnimatePresence }      from 'framer-motion'

const INTENTS = [
  {
    id:      'events',
    num:     '01',
    label:   'For Events &\nCelebrations',
    desc:    'Banners, backdrops, tags, and branded merch for your special moments.',
    message: "Hi Shamaro! I'm planning an upcoming event and would love to discuss printing options — banners, tags, and backdrops.",
  },
  {
    id:      'graduation',
    num:     '02',
    label:   'For Graduation &\nConvocation',
    desc:    'Customized jotters, tees, bottles — marking the milestone beautifully.',
    message: "Hi Shamaro! I'm graduating soon and I'd love to discuss customized jotters, tees, and bottles to celebrate.",
  },
  {
    id:      'induction',
    num:     '03',
    label:   'For Induction\nCeremony',
    desc:    'Professional jotters, awards, mugs — crafted for your induction day.',
    message: "Hi Shamaro! I have an upcoming induction and I'd like to discuss jotters, awards, and customized mugs.",
  },
  {
    id:      'brand',
    num:     '04',
    label:   'For My Brand\nor Business',
    desc:    'Merch, jerseys, caps — your brand identity made physical.',
    message: "Hi Shamaro! I'd love to create branded merchandise and apparel for my business.",
  },
  {
    id:      'appreciation',
    num:     '05',
    label:   'For Appreciation\n& Awards',
    desc:    'Wooden plaques, glass trophies, mugs — honouring people who matter.',
    message: "Hi Shamaro! I'd like to order customized awards and appreciation gifts.",
  },
  {
    id:      'others',
    num:     '06',
    label:   'Something\nElse',
    desc:    "Can't find what you're looking for? Let's talk — we print it all.",
    message: "Hi Shamaro! I have a custom printing request and I'd like to discuss the options available.",
  },
]

export default function Screen4() {
  const screenRef              = useRef(null)
  const headRef                = useRef(null)
  const cardsRef               = useRef(null)
  const [selected, setSelected] = useState(null)
  const played                  = useRef(false)

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
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0,
          duration: 1.0, delay: 0.25, ease: 'power3.out' }
      )
    }

    el.addEventListener('screen-enter', play)
    return () => el.removeEventListener('screen-enter', play)
  }, [])

  const chosen = INTENTS.find(i => i.id === selected)
  const waLink = chosen
    ? `https://wa.me/2347073495781?text=${encodeURIComponent(chosen.message)}`
    : null

  return (
    <div
      ref={screenRef}
      data-screen="4"
      className="screen screen-4 w-screen h-screen paper-texture
                 flex flex-col items-center justify-center
                 relative overflow-hidden px-6 md:px-16"
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop:  'always',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px
                      bg-gradient-to-r from-transparent
                      via-gold-600/25 to-transparent" />

      {/* Header */}
      <div ref={headRef} className="opacity-0 text-center mb-10">
        <p className="font-body text-[9px] tracking-[0.5em]
                      uppercase text-gold-600 mb-4
                      flex items-center justify-center gap-3">
          <span className="w-6 h-px bg-gold-600" />
          The Workspace
          <span className="w-6 h-px bg-gold-600" />
        </p>
        <h2
          className="font-display font-black uppercase text-ink
                     leading-[0.92] tracking-[-0.02em]"
          style={{ fontSize: 'clamp(26px,3.5vw,52px)' }}
        >
          How can we partner with you
          <br />
          <span style={{
            background:           'linear-gradient(135deg,#e8a921,#ca7312)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
          }}>
            in making your journey memorable?
          </span>
        </h2>
        <p className="font-serif italic text-dust text-sm mt-3">
          Tell us what brings you to our workspace today.
        </p>
      </div>

      {/* Intent cards */}
      <div ref={cardsRef} className="opacity-0 w-full max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {INTENTS.map((intent) => (
            <button
              key={intent.id}
              onClick={() =>
                setSelected(selected === intent.id ? null : intent.id)
              }
              className={`group p-5 border text-left
                          transition-all duration-300
                          ${selected === intent.id
                            ? 'border-gold-500 bg-gold-400'
                            : 'border-ink/10 bg-white/60 hover:border-gold-500/50 hover:bg-white'
                          }`}
            >
              <span className={`block font-serif italic text-xs mb-3
                                ${selected === intent.id
                                  ? 'text-ink/50' : 'text-gold-600'}`}>
                {intent.num}
              </span>
              <span className={`block font-display font-bold
                                text-sm leading-tight whitespace-pre-line mb-2
                                text-ink`}>
                {intent.label}
              </span>
              <span className={`block font-body text-[10px] leading-relaxed
                                ${selected === intent.id
                                  ? 'text-ink/60' : 'text-dust'}`}>
                {intent.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* WhatsApp CTA */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: 8  }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3
                         bg-ink text-chalk
                         font-body font-medium
                         text-[10px] tracking-[0.35em] uppercase
                         px-10 py-4
                         hover:bg-gold-400 hover:text-ink
                         transition-all duration-300 group"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M11.999 2C6.478 2 2 6.478 2 12c0 1.85.504 3.58 1.38 5.063L2 22l5.084-1.329A9.955 9.955 0 0012 22c5.522 0 10-4.478 10-10S17.522 2 12 2z"/>
              </svg>
              Start Conversation on WhatsApp
              <span className="transition-transform duration-300
                               group-hover:translate-x-1">→</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-px
                      bg-gradient-to-r from-transparent
                      via-gold-600/25 to-transparent" />
    </div>
  )
}