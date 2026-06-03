import { useEffect, useRef } from 'react'
import { gsap }               from 'gsap'
import Screen1                from './screens/Screen1'
import Screen2                from './screens/Screen2'
import Screen3                from './screens/Screen3'
import Screen4                from './screens/Screen4'
import Screen5                from './screens/Screen5'
import Navbar                 from './layout/Navbar'

const CROWN = new URL('../assets/logo/shamaro crown.png', import.meta.url).href

export default function Experience() {
  const navRef         = useRef(null)
  const containerRef   = useRef(null)
  const travelCrownRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const num = parseInt(entry.target.dataset.screen, 10)

          entry.target.dispatchEvent(
            new CustomEvent('screen-enter', { bubbles: false })
          )

          if (num >= 3) {
            gsap.to(navRef.current, {
              opacity:  1,
              y:        0,
              duration: 0.5,
              ease:     'power2.out',
            })
          } else {
            gsap.to(navRef.current, {
              opacity:  0,
              y:        -16,
              duration: 0.35,
            })
          }
        })
      },
      {
        root:      container,
        threshold: 0.85,
      }
    )

    container.querySelectorAll('.screen').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-hidden">

      {/* Navbar */}
      <div
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[500]"
        style={{ opacity: 0, transform: 'translateY(-16px)' }}
      >
        <Navbar />
      </div>

      {/*
        TRAVELLING CROWN
        Fixed over entire viewport.
        Real crown PNG.
        Gold filter + glow makes it visible on dark bg.
      */}
      <img
        ref={travelCrownRef}
        src={CROWN}
        alt=""
        aria-hidden="true"
        className="fixed pointer-events-none"
        style={{
          opacity:  0,
          zIndex:   999,
          top:      0,
          left:     0,
          width:    '48px',
          height:   'auto',
          filter:
            'brightness(0) sepia(1) saturate(10) hue-rotate(5deg) ' +
            'drop-shadow(0 0 8px rgba(253,191,0,1)) ' +
            'drop-shadow(0 0 20px rgba(253,191,0,0.8))',
        }}
      />

      {/* Snap container */}
      <div
        ref={containerRef}
        id="snap-container"
        className="w-screen h-screen overflow-y-scroll"
        style={{
          scrollSnapType:          'y mandatory',
          overscrollBehavior:      'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Screen1 travelCrownRef={travelCrownRef} />
        <Screen2 travelCrownRef={travelCrownRef} />
        <Screen3 />
        <Screen4 />
        <Screen5 />
      </div>

    </div>
  )
}