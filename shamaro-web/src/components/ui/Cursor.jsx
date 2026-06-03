import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot   = useRef(null)
  const ring  = useRef(null)
  const pos   = useRef({ x: 0, y: 0 })
  const trail = useRef({ x: 0, y: 0 })
  const raf   = useRef(null)

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      trail.current.x += (pos.current.x - trail.current.x) * 0.13
      trail.current.y += (pos.current.y - trail.current.y) * 0.13

      if (dot.current) {
        dot.current.style.left  = pos.current.x + 'px'
        dot.current.style.top   = pos.current.y + 'px'
      }
      if (ring.current) {
        ring.current.style.left = trail.current.x + 'px'
        ring.current.style.top  = trail.current.y + 'px'
      }
      raf.current = requestAnimationFrame(animate)
    }

    const onEnter = () => {
      dot.current?.classList.add('scale-[4]', 'opacity-20')
      ring.current?.classList.add('scale-150', '!border-gold-400')
    }
    const onLeave = () => {
      dot.current?.classList.remove('scale-[4]', 'opacity-20')
      ring.current?.classList.remove('scale-150', '!border-gold-400')
    }

    window.addEventListener('mousemove', move)
    raf.current = requestAnimationFrame(animate)

    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dot}
        className="fixed z-[9999] w-2.5 h-2.5 bg-gold-400 rounded-full
                   pointer-events-none -translate-x-1/2 -translate-y-1/2
                   mix-blend-difference transition-transform duration-200"
      />
      {/* Ring */}
      <div
        ref={ring}
        className="fixed z-[9998] w-10 h-10 border border-gold-400/40
                   rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2
                   transition-[width,height,border-color] duration-300"
      />
    </>
  )
}