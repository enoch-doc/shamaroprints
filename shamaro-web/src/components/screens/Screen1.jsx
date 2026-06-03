import { useEffect, useRef } from 'react'
import { gsap }               from 'gsap'

const LOGO  = new URL('../../assets/logo/shamaro logo.png',  import.meta.url).href
const CROWN = new URL('../../assets/logo/shamaro crown.png', import.meta.url).href

export default function Screen1({ travelCrownRef }) {
  const screenRef      = useRef(null)
  const logoWrapRef    = useRef(null)
  const staticCrownRef = useRef(null)
  const line1Ref       = useRef(null)
  const line2Ref       = useRef(null)
  const ctaRef         = useRef(null)
  const tagRef         = useRef(null)
  const travelled      = useRef(false)
  const scrollLocked   = useRef(false)

  // ── Entrance animation ──
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    tl.fromTo(tagRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
    .fromTo(logoWrapRef.current,
      { opacity: 0, scale: 0.9, y: 14 },
      { opacity: 1, scale: 1,   y: 0,
        duration: 1.0, ease: 'power3.out' },
      '-=0.2'
    )
    .fromTo(staticCrownRef.current,
      { opacity: 0, y: -24, scale: 0.4 },
      { opacity: 1, y: 0,   scale: 1,
        duration: 0.7, ease: 'back.out(2.2)' },
      '-=0.4'
    )
    .fromTo(line1Ref.current,
      { opacity: 0, y: 60, skewY: 1.5 },
      { opacity: 1, y: 0,  skewY: 0,
        duration: 0.95, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo(line2Ref.current,
      { opacity: 0, y: 60, skewY: 1.5 },
      { opacity: 1, y: 0,  skewY: 0,
        duration: 0.95, ease: 'power3.out' },
      '-=0.65'
    )
    .fromTo(ctaRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.3'
    )
  }, [])

  // ── Crown launch when Continue is clicked ──
  // We intercept the scroll button click so we can:
  // 1. Launch the crown animation
  // 2. Then scroll to Screen2 after a short delay
  // This guarantees the crown travels WHILE the screen transitions
  const handleContinue = () => {
    if (scrollLocked.current) return
    scrollLocked.current = true
    launchCrown()
  }

  const launchCrown = () => {
    const staticCrown = staticCrownRef.current
    const travelCrown = travelCrownRef?.current
    if (!staticCrown || !travelCrown) return

    // ── Get exact position of static crown on screen ──
    const fromRect = staticCrown.getBoundingClientRect()
    const fromX    = fromRect.left + fromRect.width  / 2
    const fromY    = fromRect.top  + fromRect.height / 2

    // ── Get exact position of Spark text on Screen2 ──
    // Screen2 spark target element has id="spark-target"
    // We read it directly — no guessing
    const sparkEl  = document.getElementById('spark-target')
    let   toX      = window.innerWidth  * 0.18  // fallback
    let   toY      = window.innerHeight * 1.46  // fallback

    if (sparkEl) {
      const container    = screenRef.current?.parentElement
      const scrollOffset = container?.scrollTop || 0
      const sparkRect    = sparkEl.getBoundingClientRect()
      // getBoundingClientRect is relative to viewport
      // Spark is on Screen2 (not yet visible) so we need
      // to account for it being 1 viewport below
      toX = sparkRect.left + 4
      toY = sparkRect.top  + window.innerHeight - travelCrown.offsetHeight - 8
    }

    const crownW = travelCrown.offsetWidth
    const crownH = travelCrown.offsetHeight

    // Place travel crown exactly over static crown
    gsap.set(travelCrown, {
      opacity: 1,
      x:       fromX - crownW / 2,
      y:       fromY - crownH / 2,
      scale:   1,
      rotate:  0,
    })

    // Hide static crown — handoff begins
    gsap.set(staticCrown, { opacity: 0 })

    // ── Scroll to Screen2 simultaneously ──
    // Small delay so user sees crown start moving
    setTimeout(() => {
      const container = screenRef.current?.parentElement
      container?.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
    }, 200)

    // ── Arc animation ──
    // We use keyframes to create a smooth curved path
    // without any plugin complexity.
    // The midpoint X creates the arc effect.
    const midX   = fromX + (toX - fromX) * 0.5 + 60
    const midY   = fromY + (toY - fromY) * 0.4

    gsap.to(travelCrown, {
      duration: 1.4,
      ease:     'power2.inOut',
      keyframes: [
        {
          // Start — at logo crown position
          x:       fromX - crownW / 2,
          y:       fromY - crownH / 2,
          rotate:  0,
          scale:   1,
          ease:    'power1.in',
          duration: 0,
        },
        {
          // Mid arc — curves through the transition
          x:       midX - crownW / 2,
          y:       midY - crownH / 2,
          rotate:  180,
          scale:   0.85,
          ease:    'none',
          duration: 0.65,
        },
        {
          // Landing — above "Spark" text
          x:       toX - crownW / 2,
          y:       toY - crownH / 2,
          rotate:  360,
          scale:   1,
          ease:    'power2.out',
          duration: 0.75,
        },
      ],
      onComplete: () => {
        scrollLocked.current = false
        // Small bounce on landing
        gsap.to(travelCrown, {
          y:        `-=${8}`,
          duration: 0.15,
          ease:     'power2.out',
          yoyo:     true,
          repeat:   1,
        })
      },
    })
  }

  return (
    <div
      ref={screenRef}
      data-screen="1"
      className="screen screen-1 w-screen h-screen paper-texture
                 flex flex-col items-center justify-center
                 relative overflow-hidden"
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop:  'always',
      }}
    >
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none
                      shadow-[inset_0_0_140px_rgba(0,0,0,0.07)]" />

      {/* Top-left */}
      <div ref={tagRef}
           className="absolute top-8 left-6 md:top-10 md:left-10
                      opacity-0 flex items-center gap-2">
        <span className="w-5 h-px bg-gold-600" />
        <p className="font-body text-[8px] md:text-[9px]
                      tracking-[0.5em] uppercase text-dust">
          Ogbomoso · Nigeria
        </p>
      </div>

      {/* Top-right */}
      <div className="absolute top-8 right-6 md:top-10 md:right-10">
        <p className="font-body text-[8px] md:text-[9px]
                      tracking-[0.4em] uppercase text-dust/40">
          {/* Est. 2022 */}
        </p>
      </div>

      {/* Logo block */}
      <div
        ref={logoWrapRef}
        className="relative mb-8 md:mb-10 opacity-0"
      >
        {/* Static crown — visible on cream bg naturally */}
        <img
          ref={staticCrownRef}
          src={CROWN}
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none z-10 object-contain"
          style={{
            width:     '30%',
            top:       '-30%',
            left:      '50%',
            transform: 'translateX(-50%)',
          }}
        />
        <img
          src={LOGO}
          alt="Shamaro Printing Enterprise"
          className="w-32 md:w-52 h-auto object-contain"
        />
      </div>

      {/* Headline */}
      <div className="text-center px-4 md:px-0">
        <div className="overflow-hidden mb-1">
          <div ref={line1Ref} className="opacity-0">
            <h1
              className="font-display font-black uppercase
                         leading-[0.88] tracking-[-0.03em] text-ink"
              style={{ fontSize: 'clamp(36px,7vw,124px)' }}
            >
              Such a delight
            </h1>
          </div>
        </div>

        <div className="overflow-hidden">
          <div ref={line2Ref} className="opacity-0">
            <h1
              className="font-display font-black uppercase
                         leading-[0.88] tracking-[-0.03em]"
              style={{
                fontSize:             'clamp(36px,7vw,124px)',
                background:           'linear-gradient(135deg,#e8a921 0%,#ca7312 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}
            >
              to have you.
            </h1>
          </div>
        </div>
      </div>

      {/* CTA — clicking this launches the crown */}
      <div ref={ctaRef} className="mt-10 md:mt-14 opacity-0">
        <button
          onClick={handleContinue}
          className="group flex flex-col items-center gap-3
                     font-body text-[9px] tracking-[0.5em]
                     uppercase text-dust
                     hover:text-ink transition-colors duration-300"
        >
          <span>Continue</span>
          <span className="block w-px h-10
                           bg-gradient-to-b from-gold-600 to-transparent
                           animate-bounce" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px
                      bg-gradient-to-r from-transparent
                      via-gold-600/25 to-transparent" />
    </div>
  )
}