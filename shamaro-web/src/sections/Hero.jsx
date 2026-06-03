import { useEffect, useRef, useState } from 'react'
import { motion, useScroll,
         useTransform, useSpring }      from 'framer-motion'
import { gsap }                         from 'gsap'
import { ScrollTrigger }                from 'gsap/ScrollTrigger'
import HeroScene                        from '../components/three/HeroScene'

gsap.registerPlugin(ScrollTrigger)

const LOGO  = '/src/assets/logo/shamaro logo.png'
const CROWN = '/src/assets/logo/shamaro crown.png'

// Characters for typewriter effect
function TypeWriter({ text, delay = 0, className = '' }) {
  const [displayed, setDisplayed] = useState('')
  const [started,   setStarted]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(iv)
    }, 55)
    return () => clearInterval(iv)
  }, [started, text])

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="inline-block w-0.5 h-[0.85em] bg-gold-400
                         ml-1 animate-pulse align-middle" />
      )}
    </span>
  )
}

export default function Hero() {
  const containerRef = useRef(null)
  const crownRef     = useRef(null)
  const logoRef      = useRef(null)
  const ctaRef       = useRef(null)

  const { scrollYProgress } = useScroll({
    target:  containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax transforms
  const yLogo    = useTransform(scrollYProgress, [0, 1], [0, -120])
  const yText    = useTransform(scrollYProgress, [0, 1], [0, -80])
  const ySlow    = useTransform(scrollYProgress, [0, 1], [0, -40])
  const opacity  = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const scale    = useTransform(scrollYProgress, [0, 0.5], [1, 0.94])

  const yLogoS   = useSpring(yLogo,  { stiffness: 60, damping: 18 })
  const yTextS   = useSpring(yText,  { stiffness: 60, damping: 18 })
  const ySlowS   = useSpring(ySlow,  { stiffness: 60, damping: 18 })

  // Crown scroll animation
  // Crown floats up and away as user scrolls — GSAP handles the
  // cross-section journey. The crown PNG in the nav receives it.
  useEffect(() => {
    if (!crownRef.current) return

    const ctx = gsap.context(() => {
      // Crown entrance — drops in with bounce after logo appears
      gsap.fromTo(crownRef.current,
        { y: -30, opacity: 0, scale: 0.5 },
        { y: 0,   opacity: 1, scale: 1,
          duration: 0.9, delay: 2.0,
          ease: 'back.out(2)' }
      )

      // Crown scroll — lifts off logo and travels upward
      gsap.to(crownRef.current, {
        scrollTrigger: {
          trigger:  containerRef.current,
          start:    'top top',
          end:      'bottom top',
          scrub:    1.2,
        },
        y:       -160,
        x:       0,
        scale:   0.3,
        opacity: 0,
        ease:    'none',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // CTA button entrance
  useEffect(() => {
    if (!ctaRef.current) return
    gsap.fromTo(ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.9, delay: 3.2, ease: 'power2.out' }
    )
  }, [])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen overflow-hidden bg-ink"
    >
      {/* Three.js background */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 z-[1] pointer-events-none
                      bg-gradient-to-b
                      from-black/50 via-transparent to-black" />
      <div className="absolute inset-0 z-[1] pointer-events-none
                      bg-gradient-to-r
                      from-black/50 via-transparent to-transparent" />

      {/* Radial gold glow behind logo */}
      <div className="absolute inset-0 z-[1] pointer-events-none
                      bg-radial-gold" />

      {/* Vertical rule */}
      <motion.div
        style={{ opacity }}
        className="absolute left-8 md:left-14 top-0 bottom-0 z-[2]
                   w-px bg-gradient-to-b
                   from-transparent via-gold-400/20 to-transparent"
      />

      {/* ── MAIN CONTENT ── */}
      <motion.div
        style={{ scale, opacity }}
        className="relative z-[3] min-h-screen
                   flex flex-col items-center justify-center
                   px-6 md:px-14 text-center pt-20 pb-40"
      >
        {/* Eyebrow */}
        <motion.div
          style={{ y: ySlowS }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="block w-8 h-px bg-gold-400/50" />
          <p className="font-body text-[9px] tracking-[0.6em]
                        text-gold-500 uppercase">
            Ogbomoso, Nigeria · Est. 2022
          </p>
          <span className="block w-8 h-px bg-gold-400/50" />
        </motion.div>

        {/* Logo + Crown */}
        <motion.div
          ref={logoRef}
          style={{ y: yLogoS }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.6,
                        ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-14 inline-block"
        >
          {/* Glow ring behind logo */}
          <div className="absolute inset-0 -z-10 scale-[2]
                          bg-gold-400/8 blur-3xl rounded-full" />

          {/* Real logo */}
          <img
            src={LOGO}
            alt="Shamaro Printing Enterprise"
            className="w-40 md:w-52 h-auto object-contain
                       drop-shadow-[0_0_40px_rgba(253,191,0,0.3)]"
          />

          {/* Crown — animated separately via GSAP */}
          <img
            ref={crownRef}
            src={CROWN}
            alt=""
            aria-hidden="true"
            className="absolute -top-6 left-1/2 -translate-x-1/2
                       w-10 h-auto object-contain pointer-events-none
                       drop-shadow-[0_0_12px_rgba(253,191,0,0.9)]"
            style={{ opacity: 0 }} // GSAP controls this
          />
        </motion.div>

        {/* Primary headline — typewriter */}
        <motion.div
          style={{ y: yTextS }}
          className="mb-4"
        >
          <h1 className="font-display font-black uppercase
                         text-[clamp(36px,6vw,88px)]
                         leading-[0.9] tracking-[-0.02em] text-chalk">
            <TypeWriter
              text="Such a delight"
              delay={1200}
            />
          </h1>
          <h1 className="font-display font-black uppercase
                         text-[clamp(36px,6vw,88px)]
                         leading-[0.9] tracking-[-0.02em]
                         text-gold-gradient">
            <TypeWriter
              text="to have you here."
              delay={2200}
            />
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.div
          style={{ y: ySlowS }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.6 }}
          className="mb-3"
        >
          <p className="font-serif text-base md:text-xl italic
                        text-fog/80 max-w-xl mx-auto leading-relaxed">
            Welcome to Shamaro Printing Enterprise —
            Your #1 Online Printing Partner.
          </p>
        </motion.div>

        {/* Animated rotating tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 4.0 }}
          className="mb-14"
        >
          <RotatingTagline />
        </motion.div>

        {/* CTA */}
        <div ref={ctaRef} style={{ opacity: 0 }}>
          <a
            href="#workspace"
            className="group inline-flex items-center gap-3
                       font-body font-medium text-[11px]
                       tracking-[0.35em] uppercase
                       bg-gold-400 text-ink
                       px-10 py-4
                       hover:bg-gold-500
                       transition-all duration-300
                       hover:gap-5"
          >
            Explore Our Workspace
            <span className="transition-transform duration-300
                             group-hover:translate-x-1">↓</span>
          </a>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 right-8 md:right-14 z-[3]
                   flex flex-col items-center gap-3"
      >
        <div className="w-px h-12
                        bg-gradient-to-b from-gold-600 to-transparent
                        animate-pulse" />
        <p className="font-body text-[8px] tracking-[0.45em]
                      uppercase text-dust
                      [writing-mode:vertical-rl]">
          Scroll
        </p>
      </motion.div>

      {/* Bottom ticker */}
      <div className="absolute bottom-0 left-0 right-0 z-[4]
                      overflow-hidden bg-gold-400 py-3">
        <Ticker />
      </div>
    </section>
  )
}

/* ── Rotating tagline ── */
const TAGLINES = [
  "Let's make your heart spark ✨",
  "From concept to creation.",
  "We print it all.",
  "Your vision, made physical.",
]

function RotatingTagline() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => {
      setIdx(i => (i + 1) % TAGLINES.length)
    }, 2800)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="h-8 flex items-center justify-center overflow-hidden">
      <motion.p
        key={idx}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        exit={{    y: -20, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif italic text-gold-400 text-sm
                   md:text-base tracking-wide"
      >
        {TAGLINES[idx]}
      </motion.p>
    </div>
  )
}

/* ── Ticker ── */
const TICKER_ITEMS = [
  'Concept to Creation',
  'Custom Apparel',
  'Induction Jotters',
  'Wooden & Glass Awards',
  'Customized Bottles & Mugs',
  'Banners & Tags',
  'Shamaro Printing Enterprise',
  'We Print It All',
]

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="flex whitespace-nowrap
                    animate-[ticker_28s_linear_infinite]">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-6
                     font-body font-medium
                     text-[9px] tracking-[0.45em]
                     uppercase text-ink px-6"
        >
          {item}
          <span className="w-1 h-1 bg-ink/25 rounded-full flex-shrink-0" />
        </span>
      ))}
    </div>
  )
}