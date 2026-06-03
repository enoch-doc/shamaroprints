import { useEffect, useRef } from 'react'
import { gsap }               from 'gsap'

const CROWN = new URL('../../assets/logo/shamaro crown.png', import.meta.url).href

const TICKER_ITEMS = [
  'Concept to Creation', 'Custom Apparel', 'Induction Jotters',
  'Wooden & Glass Awards', 'Customized Bottles & Mugs',
  'Banners & Tags', 'Shamaro Printing Enterprise', 'We Print It All',
]

function Ticker() {
  const all = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="flex whitespace-nowrap animate-[ticker_30s_linear_infinite]">
      {all.map((item, i) => (
        <span key={i}
              className="inline-flex items-center gap-5
                         font-body font-medium text-[9px]
                         tracking-[0.45em] uppercase text-ink px-5">
          {item}
          <span className="w-1 h-1 bg-ink/20 rounded-full flex-shrink-0" />
        </span>
      ))}
    </div>
  )
}

export default function Screen2({ travelCrownRef }) {
  const screenRef      = useRef(null)
  const staticCrownRef = useRef(null)
  const headlineRef    = useRef(null)
  const line1Ref       = useRef(null)
  const line2Ref       = useRef(null)
  const line3Ref       = useRef(null)
  const sparkRef       = useRef(null)
  const preRef         = useRef(null)
  const subRef         = useRef(null)
  const played         = useRef(false)

  const scrollNext = () => {
    const container = screenRef.current?.parentElement
    container?.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
  }

  useEffect(() => {
    const el = screenRef.current
    if (!el) return

    const play = () => {
      if (played.current) return
      played.current = true

      const tl = gsap.timeline()

      // ── Text lines animate in ──
      tl.fromTo(preRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
      .fromTo(line1Ref.current,
        { opacity: 0, y: 64, skewY: 1.5 },
        { opacity: 1, y: 0,  skewY: 0,
          duration: 0.95, ease: 'power3.out' },
        '-=0.1'
      )
      .fromTo(line2Ref.current,
        { opacity: 0, y: 64, skewY: 1.5 },
        { opacity: 1, y: 0,  skewY: 0,
          duration: 0.95, ease: 'power3.out' },
        '-=0.65'
      )
      .fromTo(line3Ref.current,
        { opacity: 0, y: 64, skewY: 1.5 },
        { opacity: 1, y: 0,  skewY: 0,
          duration: 0.95, ease: 'power3.out' },
        '-=0.65'
      )

      // ── Crown lands and begins performance ──
      .fromTo(staticCrownRef.current,
        { opacity: 0, scale: 1.05 },
        {
          opacity:  1,
          scale:    1,
          duration: 0.35,
          ease:     'power2.out',
          onStart: () => {
            // Fade out travel crown — handoff
            if (travelCrownRef?.current) {
              gsap.to(travelCrownRef.current, {
                opacity:  0,
                duration: 0.3,
              })
            }
            // Begin crown performance after it lands
            setTimeout(() => animateCrown(), 400)
          },
        },
        '-=0.2'
      )

      // ── Sub copy fades in ──
      .fromTo(subRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.1'
      )
    }

    el.addEventListener('screen-enter', play)
    return () => el.removeEventListener('screen-enter', play)
  }, [travelCrownRef])

  const animateCrown = () => {
    const crown   = staticCrownRef.current
    const sparkEl = sparkRef.current
    if (!crown || !sparkEl) return

    // ── Measure Spark text width ──
    // Crown will sweep across the full width of "Spark."
    const sparkRect = sparkEl.getBoundingClientRect()
    const crownRect = crown.getBoundingClientRect()

    // How far left can the crown go (above first letter)
    const rightBound  = 0
    // How far right (above last letter, minus crown width)
    const leftBound = sparkRect.width - crownRect.width - 8

    // Current crown x relative to sparkEl
    // We animate using CSS left inside the relative container
    // Convert to percentage of sparkEl width for responsiveness

    /*
      CROWN PERFORMANCE SEQUENCE:
      1. Settle — tiny bob after landing
      2. Sweep left to right — slow drift across "Spark"
      3. Hover at right — pause
      4. Sweep back right to left — return
      5. Settle center — comes to rest above S
      6. Infinite slow glow pulse + micro float forever
    */

    const masterTl = gsap.timeline()

    // 1. Settle bob
    masterTl.to(crown, {
      y:        '-=6',
      duration: 0.18,
      ease:     'power2.out',
      yoyo:     true,
      repeat:   1,
    })

    // 2. Sweep left → right
    .to(crown, {
      x:        `+=${leftBound - rightBound}`,
      duration: 1.8,
      ease:     'power1.inOut',
    }, '+=0.3')

    // 3. Pause at right — crown bobs gently
    .to(crown, {
      y:        '-=4',
      duration: 0.25,
      ease:     'power2.out',
      yoyo:     true,
      repeat:   1,
    })

    // 4. Sweep right → left (back)
    .to(crown, {
      x:        `-=${rightBound - leftBound}`,
      duration: 1.8,
      ease:     'power1.inOut',
    }, '+=0.3')

    // 5. Settle to slightly right of start (natural resting position)
    .to(crown, {
      x:        `+=${(rightBound - leftBound) * 0.2}`,
      duration: 0.8,
      ease:     'power2.out',
    })

    // 6. After sweep — infinite float + glow loop
    .add(() => {
      // Infinite micro-float — crown hovers perpetually
      gsap.to(crown, {
        y:        '-=6',
        duration: 1.8,
        ease:     'sine.inOut',
        yoyo:     true,
        repeat:   -1,
      })

      // Infinite glow pulse using filter intensity
      // We animate a CSS variable that drives the filter
      gsap.to(crown, {
        duration: 1.4,
        ease:     'sine.inOut',
        yoyo:     true,
        repeat:   -1,
        onUpdate: function() {
          const p = (Math.sin(Date.now() / 700) + 1) / 2
          // Interpolate between dim glow and bright glow
          const blur1 = 6  + p * 10   // 6–16px
          const blur2 = 16 + p * 20   // 16–36px
          const blur3 = 30 + p * 20   // 30–50px
          const op1   = 0.8 + p * 0.2 // 0.8–1.0
          const op2   = 0.5 + p * 0.4 // 0.5–0.9
          const op3   = 0.3 + p * 0.3 // 0.3–0.6
          crown.style.filter =
            `brightness(0) sepia(1) saturate(10) hue-rotate(5deg) ` +
            `drop-shadow(0 0 ${blur1}px rgba(253,191,0,${op1})) ` +
            `drop-shadow(0 0 ${blur2}px rgba(253,191,0,${op2})) ` +
            `drop-shadow(0 0 ${blur3}px rgba(253,191,0,${op3}))`
        },
      })

      // Subtle slow rotation sway — like a crown rocking
      gsap.to(crown, {
        rotate:   4,
        duration: 2.2,
        ease:     'sine.inOut',
        yoyo:     true,
        repeat:   -1,
      })
    })
  }

  return (
    <div
      ref={screenRef}
      data-screen="2"
      className="screen screen-2 w-screen h-screen dark-texture
                 flex flex-col items-center justify-center
                 relative overflow-hidden px-4 md:px-0"
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop:  'always',
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(253,191,0,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Eyebrow */}
      <p
        ref={preRef}
        className="font-body text-[8px] md:text-[9px]
                   tracking-[0.45em] md:tracking-[0.55em]
                   uppercase text-gold-500 mb-8 md:mb-10
                   opacity-0 flex items-center gap-3"
      >
        <span className="w-4 md:w-6 h-px bg-gold-600" />
        Your #1 Online Printing Partner
        <span className="w-4 md:w-6 h-px bg-gold-600" />
      </p>

      {/*
        HEADLINE BLOCK
        overflow: visible — crown sweeps outside bounds
        position: relative — crown positions inside this
      */}
      <div
        ref={headlineRef}
        className="relative text-center"
        style={{ overflow: 'visible' }}
      >
        {/*
          STATIC CROWN
          Positioned above "Spark" left edge initially.
          animateCrown() moves it left→right across the word.
          filter: gold + glow — visible on dark background.
          The glow pulses via onUpdate in animateCrown.
        */}
        <img
          ref={staticCrownRef}
          src={CROWN}
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none z-20 object-contain"
          style={{
            opacity:   0,
            bottom:    '0%',
            left:      '2%',
            transform: 'translateY(-108%)',
            width:     'clamp(28px,3.5vw,48px)',
            // Gold filter — visible on dark bg
            filter:
              'brightness(0) sepia(1) saturate(10) hue-rotate(5deg) ' +
              'drop-shadow(0 0 8px rgba(253,191,0,1)) ' +
              'drop-shadow(0 0 20px rgba(253,191,0,0.8)) ' +
              'drop-shadow(0 0 32px rgba(253,191,0,0.5))',
          }}
        />

        {/* Line 1 — Let's make */}
        <div className="overflow-hidden">
          <div ref={line1Ref} className="opacity-0">
            <h1
              className="font-display font-black uppercase
                         text-chalk leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(36px,7vw,124px)' }}
            >
              Let's make
            </h1>
          </div>
        </div>

        {/* Line 2 — your heart */}
        <div className="overflow-hidden">
          <div ref={line2Ref} className="opacity-0">
            <h1
              className="font-display font-black uppercase
                         text-chalk leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(36px,7vw,124px)' }}
            >
              your heart
            </h1>
          </div>
        </div>

        {/* Line 3 — Spark */}
        {/*
          sparkRef on the h1 — used to measure text width
          for the sweep animation range calculation.
          id="spark-target" — Screen1 reads for landing coords.
        */}
        <div
          className="overflow-hidden"
          style={{ overflow: 'visible' }}
        >
          <div ref={line3Ref} className="opacity-0">
            <h1
              ref={sparkRef}
              id="spark-target"
              className="font-display font-black uppercase
                         leading-[0.88] tracking-[-0.03em]
                         inline-block"
              style={{
                fontSize:             'clamp(36px,7vw,124px)',
                background:
                  'linear-gradient(135deg,#fdbf00 0%,#e8a921 50%,#ca7312 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}
            >
              Spark.
            </h1>
          </div>
        </div>
      </div>

      {/* Sub copy */}
      <div
        ref={subRef}
        className="opacity-0 mt-10 md:mt-12 text-center
                   max-w-sm md:max-w-lg px-2 md:px-6"
      >
        <p className="font-serif italic text-fog/65
                      text-base md:text-lg leading-relaxed">
          "Welcome to Shamaro Printing Enterprise —
          where every idea becomes something you can hold."
        </p>

        <button
          onClick={scrollNext}
          className="mt-8 md:mt-10 inline-flex items-center gap-3
                     font-body text-[9px] tracking-[0.5em]
                     uppercase text-dust hover:text-gold-400
                     transition-colors duration-300"
        >
          <span>See our work</span>
          <span className="block w-8 h-px bg-gold-600" />
        </button>
      </div>

      {/* Bottom ticker */}
      <div className="absolute bottom-0 left-0 right-0
                      overflow-hidden bg-gold-400 py-[11px]">
        <Ticker />
      </div>
    </div>
  )
}