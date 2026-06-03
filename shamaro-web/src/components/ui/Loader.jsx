import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence }      from 'framer-motion'

const LOGO = new URL('../../assets/logo/shamaro version a.png', import.meta.url).href

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [leaving,  setLeaving]  = useState(false)
  const iv                      = useRef(null)

  useEffect(() => {
    iv.current = setInterval(() => {
      setProgress(p => {
        const n = p + Math.random() * 4 + 2
        if (n >= 100) {
          clearInterval(iv.current)
          setTimeout(() => {
            setLeaving(true)
            setTimeout(onComplete, 1000)
          }, 400)
          return 100
        }
        return n
      })
    }, 45)
    return () => clearInterval(iv.current)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.76,0,0.24,1] } }}
          className="fixed inset-0 z-[9000] paper-texture
                     flex flex-col items-center justify-center gap-10"
        >
          <motion.img
            src={LOGO}
            alt="Shamaro"
            className="w-52 h-auto object-contain"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
          />

          <div className="flex flex-col items-center gap-3 w-44">
            <div className="w-full h-px bg-black/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0
                           bg-gradient-to-r from-gold-600 to-gold-400"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.06, ease: 'linear' }}
              />
            </div>
            <p className="font-body text-[9px] tracking-[0.5em]
                          uppercase text-dust tabular-nums">
              {Math.floor(progress)}%
            </p>
          </div>

          <p className="font-serif  text-[11px] tracking-widest
                        text-gold-600 absolute bottom-10">
            from Concept to Creation — we print it all.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}