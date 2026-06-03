import { useEffect, useRef } from 'react'
import { gsap }               from 'gsap'

const MILESTONES = [
  {
    num:   '300+',
    label: 'Print Projects\nDelivered',
    sub:   'and counting',
  },
  {
    num:   '2+',
    label: 'Countries\nReached',
    sub:   'Nigeria & beyond',
  },
  {
    num:   '100%',
    label: 'Custom\nEvery Time',
    sub:   'no templates, ever',
  },
]

const REVIEWS = [
  {
    text: "It's soooo beautiful. The pens and the card came out perfectly. I really love it.",
  },
  {
    text: "You did an amazing job with the certificates. I am sure the brand will do well.",
  },
  {
    text: "I loved the shirt, thank you. I'll also refer you — I love the fact that it came out well.",
  },
  {
    text: "Your customer service is nice. I'll keep referring you. More wins.",
  },
]

export default function Screen5() {
  const screenRef = useRef(null)
  const headRef   = useRef(null)
  const m1Ref     = useRef(null)
  const m2Ref     = useRef(null)
  const m3Ref     = useRef(null)
  const rvRef     = useRef(null)
  const played    = useRef(false)

  const mRefs = [m1Ref, m2Ref, m3Ref]

  useEffect(() => {
    const el = screenRef.current
    if (!el) return

    const play = () => {
      if (played.current) return
      played.current = true

      gsap.fromTo(headRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      gsap.fromTo(
        [m1Ref.current, m2Ref.current, m3Ref.current],
        { opacity: 0, y: 40 },
        {
          opacity:  1,
          y:        0,
          duration: 0.8,
          stagger:  0.12,
          delay:    0.2,
          ease:     'power3.out',
        }
      )
      gsap.fromTo(rvRef.current,
        { opacity: 0, y: 24 },
        {
          opacity:  1,
          y:        0,
          duration: 0.8,
          delay:    0.55,
          ease:     'power3.out',
        }
      )
    }

    el.addEventListener('screen-enter', play)
    return () => el.removeEventListener('screen-enter', play)
  }, [])

  return (
    <div
      ref={screenRef}
      data-screen="5"
      className="screen screen-5 w-screen h-screen dark-texture
                 flex flex-col relative overflow-hidden"
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop:  'always',
      }}
    >
      {/* Radial glow top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(253,191,0,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Scrollable inner — needed on mobile when content tall */}
      <div className="flex-1 overflow-y-auto
                      px-5 md:px-10 lg:px-16
                      py-8 md:py-12
                      flex flex-col gap-8 md:gap-12">

        {/* ── SECTION LABEL ── */}
        <div ref={headRef} className="opacity-0">
          <p className="font-body text-[8px] md:text-[9px]
                        tracking-[0.5em] uppercase text-gold-500
                        flex items-center gap-2">
            <span className="w-4 md:w-5 h-px bg-gold-600" />
            Why Shamaro is Your #1 Printing Partner
          </p>
        </div>

        {/* ── MILESTONES ── */}
        {/*
          Mobile:  3 columns side by side but compact
          Tablet+: 3 columns with full padding
        */}
        <div className="grid grid-cols-3 gap-px bg-white/5">
          {MILESTONES.map((m, i) => (
            <div
              key={i}
              ref={mRefs[i]}
              className="opacity-0 bg-ink-soft
                         p-4 md:p-8 lg:p-12
                         flex flex-col gap-1 md:gap-2"
            >
              {/* Number */}
              <p
                className="font-display font-black
                           leading-none tracking-tight"
                style={{
                  fontSize:             'clamp(28px,6vw,96px)',
                  background:           'linear-gradient(135deg,#fdbf00,#ca7312)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                  backgroundClip:       'text',
                }}
              >
                {m.num}
              </p>

              {/* Label */}
              <p
                className="font-display font-bold text-chalk
                           uppercase tracking-wide
                           whitespace-pre-line leading-tight"
                style={{ fontSize: 'clamp(9px,1.4vw,16px)' }}
              >
                {m.label}
              </p>

              {/* Sub */}
              <p
                className="font-serif italic text-dust/60
                           leading-tight"
                style={{ fontSize: 'clamp(8px,1.1vw,13px)' }}
              >
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── REVIEWS ── */}
        <div ref={rvRef} className="opacity-0">

          <p className="font-body text-[8px] md:text-[9px]
                        tracking-[0.5em] uppercase text-gold-500
                        mb-4 md:mb-6 flex items-center gap-2">
            <span className="w-4 md:w-5 h-px bg-gold-600" />
            Verified Client Reviews
          </p>

          {/*
            Mobile:  1 column (stacked, easy to read)
            sm:      2 columns
            lg:      4 columns
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2
                          lg:grid-cols-4 gap-2 md:gap-px
                          md:bg-white/5">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className="bg-ink-soft
                           p-5 md:p-6
                           border-t-2 border-gold-400
                           flex flex-col gap-3"
              >
                {/* Quote mark */}
                <span
                  className="font-serif text-gold-400/30 leading-none
                             select-none"
                  style={{ fontSize: 'clamp(36px,5vw,56px)' }}
                  aria-hidden="true"
                >
                  "
                </span>

                <p className="font-serif italic text-fog/80
                               leading-relaxed flex-1"
                   style={{ fontSize: 'clamp(12px,1.6vw,15px)' }}>
                  {r.text}
                </p>

                <p className="font-body text-[8px] tracking-[0.3em]
                               uppercase text-dust/50">
                  Verified · WhatsApp
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER STRIP ── */}
        <div className="flex flex-col sm:flex-row
                        items-start sm:items-center
                        justify-between gap-4 pt-4
                        border-t border-white/5">

          <p className="font-serif italic text-dust/50
                        text-xs md:text-sm">
            "from Concept to Creation — we print it all."
          </p>

          <div className="flex flex-col sm:flex-row
                          gap-3 sm:gap-6">
            
            <a
              href="https://wa.me/2347073495781"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2
                         font-body text-[9px] tracking-[0.35em]
                         uppercase text-dust
                         hover:text-gold-400
                         transition-colors duration-300"
            >
              <svg width="15px" height="15px" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
<path d="M6.014 8.00613C6.12827 7.1024 7.30277 5.87414 8.23488 6.01043L8.23339 6.00894C9.14051 6.18132 9.85859 7.74261 10.2635 8.44465C10.5504 8.95402 10.3641 9.4701 10.0965 9.68787C9.7355 9.97883 9.17099 10.3803 9.28943 10.7834C9.5 11.5 12 14 13.2296 14.7107C13.695 14.9797 14.0325 14.2702 14.3207 13.9067C14.5301 13.6271 15.0466 13.46 15.5548 13.736C16.3138 14.178 17.0288 14.6917 17.69 15.27C18.0202 15.546 18.0977 15.9539 17.8689 16.385C17.4659 17.1443 16.3003 18.1456 15.4542 17.9421C13.9764 17.5868 8 15.27 6.08033 8.55801C5.97237 8.24048 5.99955 8.12044 6.014 8.00613Z" fill="#FFFFFF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 23C10.7764 23 10.0994 22.8687 9 22.5L6.89443 23.5528C5.56462 24.2177 4 23.2507 4 21.7639V19.5C1.84655 17.492 1 15.1767 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23ZM6 18.6303L5.36395 18.0372C3.69087 16.4772 3 14.7331 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C11.0143 21 10.552 20.911 9.63595 20.6038L8.84847 20.3397L6 21.7639V18.6303Z" fill="#FFFFFF"/>
              </svg>
              WhatsApp
            </a>

            <a
              href="mailto:shamaroenterprise@gmail.com"
              className="inline-flex items-center gap-2
                         font-body text-[9px] tracking-[0.35em]
                         uppercase text-dust
                         hover:text-gold-400
                         transition-colors duration-300"
            > <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z" fill="#ffff"/>
</svg>
              Email Us
            </a>

            <a
              href="https://instagram.com/shamaroprintingenterprise"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2
                         font-body text-[9px] tracking-[0.35em]
                         uppercase text-dust
                         hover:text-gold-400
                         transition-colors duration-300"
            > <svg width="18px" height="18px" viewBox="0 -0.5 25 25" fill="ffff" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.5 5H9.5C7.29086 5 5.5 6.79086 5.5 9V15C5.5 17.2091 7.29086 19 9.5 19H15.5C17.7091 19 19.5 17.2091 19.5 15V9C19.5 6.79086 17.7091 5 15.5 5Z" stroke="#ffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 15C10.8431 15 9.5 13.6569 9.5 12C9.5 10.3431 10.8431 9 12.5 9C14.1569 9 15.5 10.3431 15.5 12C15.5 12.7956 15.1839 13.5587 14.6213 14.1213C14.0587 14.6839 13.2956 15 12.5 15Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="15.5" y="9" width="2" height="2" rx="1" transform="rotate(-90 15.5 9)" fill="#ffff"/>
<rect x="16" y="8.5" width="1" height="1" rx="0.5" transform="rotate(-90 16 8.5)" stroke="#ffff" stroke-linecap="round"/>
</svg>
              Instagram
            </a>
          </div>
        </div>

        {/* Bottom breathing room on mobile */}
        <div className=" m-auto text-center " />

      </div>
    </div>
  )
}