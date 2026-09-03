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
    <div className="flex whitespace-nowrap
                    animate-[ticker_30s_linear_infinite]">
      {all.map((item, i) => (
        <span key={i}
              className="inline-flex items-center gap-5
                         font-body font-medium text-[9px]
                         tracking-[0.45em] uppercase text-ink px-5">
          {item}
          <span className="w-1 h-1 bg-ink/20 rounded-full
                           flex-shrink-0" />
        </span>
      ))}
    </div>
  )
}

/* ── Gold filter style — makes black PNG/SVG visible on dark bg ── */
const GOLD_FILTER =
  'brightness(0) sepia(1) saturate(10) hue-rotate(5deg) ' +
  'drop-shadow(0 0 6px rgba(253,191,0,1)) ' +
  'drop-shadow(0 0 16px rgba(253,191,0,0.85)) ' +
  'drop-shadow(0 0 32px rgba(253,191,0,0.5))'

/* ── Crown SVG — matches brand mark proportions ── */
function CrownSVG({ style = {}, className = '' }) {
  return (
    <svg
      viewBox="0 0 80 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <circle cx="40" cy="5"  r="5" fill="#fdbf00" />
      <circle cx="14" cy="14" r="4" fill="#fdbf00" />
      <circle cx="66" cy="14" r="4" fill="#fdbf00" />
      <path
        d="M6 50 L14 14 L28 34 L40 5 L52 34 L66 14 L74 50 Z"
        fill="#fdbf00"
        opacity="0.95"
      />
      <rect x="6" y="46" width="68" height="7" rx="2" fill="#e8a921" />
    </svg>
  )
}

/* ── Heart SVG — same bounding box as crown ── */
function HeartSVG({ style = {}, className = '' }) {
  return (
    <svg
      viewBox="0 0 80 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M40 48
           C40 48 8 32 8 18
           C8 10 14 4 22 4
           C28 4 34 8 40 14
           C46 8 52 4 58 4
           C66 4 72 10 72 18
           C72 32 40 48 40 48 Z"
        fill="#fdbf00"
        opacity="0.95"
      />
    </svg>
  )
}

export default function Screen2({ travelCrownRef }) {
  const screenRef       = useRef(null)

  /* The static PNG crown — used immediately after travel lands */
  const staticCrownRef  = useRef(null)

  /* The SVG crown — shown after PNG fades, for the morph loop */
  const svgCrownRef     = useRef(null)

  /* The SVG heart — morphs from/to crown */
  const svgHeartRef     = useRef(null)

  const headlineRef     = useRef(null)
  const line1Ref        = useRef(null)
  const line2Ref        = useRef(null)
  const line3Ref        = useRef(null)
  const preRef          = useRef(null)
  const subRef          = useRef(null)
  const played          = useRef(false)
  const morphLoop       = useRef(null)

  const scrollNext = () => {
    const container = screenRef.current?.parentElement
    container?.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
  }

  /* ── Crown → Heart → Crown morph loop ── */
  const startMorphLoop = () => {
    const crown = svgCrownRef.current
    const heart = svgHeartRef.current
    if (!crown || !heart) return

    /* Initial state */
    gsap.set(crown, { opacity: 1, scale: 1 })
    gsap.set(heart, { opacity: 0, scale: 0.8 })

    const tl = gsap.timeline({ repeat: -1 })

    /* 1. Crown rests — gentle float */
    tl.to(crown, {
      y:        -4,
      duration: 0.8,
      ease:     'sine.inOut',
      yoyo:     true,
      repeat:   2,
    })

    /* 2. Crown glow intensifies before morph */
    .to(crown, {
      filter:
        'brightness(0) sepia(1) saturate(15) hue-rotate(5deg) ' +
        'drop-shadow(0 0 10px rgba(253,191,0,1)) ' +
        'drop-shadow(0 0 28px rgba(253,191,0,1)) ' +
        'drop-shadow(0 0 48px rgba(253,191,0,0.8))',
      duration: 0.5,
      ease:     'power2.in',
    })

    /* 3. Crown scales down + fades → Heart scales up + fades in */
    .to(crown, {
      opacity:  0,
      scale:    0.6,
      y:        6,
      duration: 0.45,
      ease:     'power2.in',
    })
    .fromTo(heart,
      { opacity: 0, scale: 0.6, y: 6 },
      {
        opacity:  1,
        scale:    1,
        y:        0,
        duration: 0.45,
        ease:     'back.out(1.8)',
      },
      '-=0.15'
    )

    /* 4. Heart beats — two quick pulses */
    .to(heart, {
      scale:    1.18,
      duration: 0.18,
      ease:     'power2.out',
      yoyo:     true,
      repeat:   1,
    })
    .to(heart, {
      scale:    1.12,
      duration: 0.14,
      ease:     'power2.out',
      yoyo:     true,
      repeat:   1,
    }, '-=0.05')

    /* 5. Heart glow pulses warmly */
    .to(heart, {
      filter:
        'brightness(0) sepia(1) saturate(15) hue-rotate(355deg) ' +
        'drop-shadow(0 0 12px rgba(253,191,0,1)) ' +
        'drop-shadow(0 0 30px rgba(253,100,50,0.9)) ' +
        'drop-shadow(0 0 50px rgba(253,191,0,0.6))',
      duration: 0.6,
      ease:     'sine.inOut',
      yoyo:     true,
      repeat:   2,
    })

    /* 6. Heart floats gently */
    .to(heart, {
      y:        -5,
      duration: 0.9,
      ease:     'sine.inOut',
      yoyo:     true,
      repeat:   2,
    })

    /* 7. Heart → Crown reverse morph */
    .to(heart, {
      opacity:  0,
      scale:    0.6,
      y:        -6,
      duration: 0.45,
      ease:     'power2.in',
    })
    .fromTo(crown,
      { opacity: 0, scale: 0.6, y: -6 },
      {
        opacity:  1,
        scale:    1,
        y:        0,
        filter:   GOLD_FILTER,
        duration: 0.45,
        ease:     'back.out(1.8)',
      },
      '-=0.15'
    )

    /* 8. Crown rests before next loop */
    .to(crown, {
      duration: 1.2,
      ease:     'none',
    })

    morphLoop.current = tl
  }

  useEffect(() => {
    const el = screenRef.current
    if (!el) return

    const play = () => {
      if (played.current) return
      played.current = true

      const tl = gsap.timeline()

      /* Text lines animate in */
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

      /* Static PNG crown fades in — travel crown handoff */
      .fromTo(staticCrownRef.current,
        { opacity: 0, scale: 1.05 },
        {
          opacity:  1,
          scale:    1,
          duration: 0.35,
          ease:     'power2.out',
          onStart: () => {
            /* Hide travel crown */
            if (travelCrownRef?.current) {
              gsap.to(travelCrownRef.current, {
                opacity:  0,
                duration: 0.25,
              })
            }
          },
        },
        '-=0.2'
      )

      /* PNG crown fades out → SVG crown fades in seamlessly */
      /* Then morph loop begins */
      .to(staticCrownRef.current, {
        opacity:  0,
        duration: 0.4,
        delay:    0.6,
        ease:     'power2.in',
        onComplete: () => {
          /* Switch to SVG crown */
          gsap.set(svgCrownRef.current, { opacity: 1 })
          gsap.set(staticCrownRef.current, { display: 'none' })

          /* Small pause then start the morph loop */
          setTimeout(() => startMorphLoop(), 600)
        },
      })

      /* Sub copy */
      .fromTo(subRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.5'
      )
    }

    el.addEventListener('screen-enter', play)
    return () => {
      el.removeEventListener('screen-enter', play)
      /* Kill morph loop on unmount */
      morphLoop.current?.kill()
    }
  }, [travelCrownRef])

  /* Shared style for all crown/heart elements */
  const symbolStyle = {
    position:  'absolute',
    bottom:    '0%',
    left:      '2%',
    transform: 'translateY(-108%)',
    width:     'clamp(28px,3.5vw,48px)',
    filter:    GOLD_FILTER,
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

      {/* Headline block */}
      <div
        ref={headlineRef}
        className="relative text-center"
        style={{ overflow: 'visible' }}
      >

        {/*
          THREE layered elements above "Spark":
          1. staticCrownRef — real PNG, first to appear (handoff from travel)
          2. svgCrownRef    — SVG crown, takes over from PNG
          3. svgHeartRef    — SVG heart, morphs from/to crown
          All share the same absolute position above "Spark"
        */}

        {/* 1. Static PNG crown */}
        <img
          ref={staticCrownRef}
          src={CROWN}
          alt=""
          aria-hidden="true"
          className="pointer-events-none z-20 object-contain"
          style={{
            ...symbolStyle,
            opacity: 0,
            position: 'absolute',
          }}
        />

        {/* 2. SVG Crown — for morph animation */}
        <div
          ref={svgCrownRef}
          className="pointer-events-none z-20"
          style={{
            ...symbolStyle,
            opacity: 0,
            position: 'absolute',
          }}
        >
          <CrownSVG style={{ width: '100%', height: 'auto' }} />
        </div>

        {/* 3. SVG Heart — morphs from crown */}
        <div
          ref={svgHeartRef}
          className="pointer-events-none z-20"
          style={{
            ...symbolStyle,
            opacity: 0,
            position: 'absolute',
            filter:
              'brightness(0) sepia(1) saturate(10) hue-rotate(355deg) ' +
              'drop-shadow(0 0 6px rgba(253,191,0,1)) ' +
              'drop-shadow(0 0 20px rgba(253,100,50,0.9)) ' +
              'drop-shadow(0 0 36px rgba(253,191,0,0.5))',
          }}
        >
          <HeartSVG style={{ width: '100%', height: 'auto' }} />
        </div>

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
        <div
          className="overflow-hidden"
          style={{ overflow: 'visible' }}
        >
          <div ref={line3Ref} className="opacity-0">
            <h1
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
                     uppercase text-dust
                     hover:text-gold-400
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