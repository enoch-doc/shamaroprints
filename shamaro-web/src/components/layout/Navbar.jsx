import { useState }      from 'react'
import { Link }          from 'react-router-dom'
import { motion }        from 'framer-motion'

const LOGO  = new URL('../../assets/logo/shamaro logo - Copy.png',  import.meta.url).href
const CROWN = new URL('../../assets/logo/shamaro crown.png', import.meta.url).href

const LINKS = [
  { label: 'Workspace', href: '#workspace' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Reviews',   href: '#reviews'   },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
   <nav className="w-full h-[68px] px-8 md:px-14
                flex items-center justify-between
                bg-chalk border-b border-ink/8">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="relative h-8">
          <img src={LOGO}  alt="Shamaro" className="h-full w-auto object-contain" />
          <img src={CROWN} alt=""        aria-hidden="true"
               className="absolute -top-2 left-1/2 -translate-x-1/2
                          w-0 h-auto object-contain
                          drop-shadow-[0_0_8px_rgba(253,191,0,0.8)]" />
        </div>
        <div>
          <p className="font-display text-[14px] font-bold
                        tracking-[0.2em] text-gold-400 leading-none">
            SHAMARO
          </p>
          <p className="font-body text-[7px] tracking-[0.4em]
                        text-dust uppercase mt-[3px]">
            Printing Enterprise
          </p>
        </div>
      </Link>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-8">
        {LINKS.map(l => (
          <a key={l.label} href={l.href}
             className="font-body text-[10px] tracking-[0.3em]
                        uppercase text-dust hover:text-chalk
                        transition-colors duration-300 relative group">
            {l.label}
            <span className="absolute -bottom-0.5 left-0 w-0 h-px
                             bg-gold-400 transition-all duration-300
                             group-hover:w-full" />
          </a>
        ))}
        <a href="https://wa.me/2347073495781"
           target="_blank" rel="noreferrer"
           className="font-body text-[10px] tracking-[0.28em]
                      uppercase font-medium bg-gold-400 text-ink
                      px-5 py-[10px]
                      hover:bg-gold-500 transition-colors duration-300">
          Get a Quote
        </a>
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setOpen(!open)}
              className="md:hidden flex flex-col gap-[5px] p-2">
        {[0,1,2].map(i => (
          <span key={i}
                className={`block h-px bg-chalk transition-all duration-300
                  ${i===0?`w-5 ${open?'rotate-45 translate-y-[5px]':''}`:''}
                  ${i===1?`w-3 ${open?'opacity-0':''}`:''}
                  ${i===2?`w-5 ${open?'-rotate-45 -translate-y-[5px]':''}`:''}
                `} />
        ))}
      </button>

      {/* Mobile drawer */}
      <motion.div
        initial={false}
        animate={open ? { x:0 } : { x:'100%' }}
        transition={{ duration:0.4, ease:[0.76,0,0.24,1] }}
        className="fixed top-0 right-0 bottom-0 z-[499]
                   w-64 bg-ink-3 border-l border-gold-400/10
                   flex flex-col justify-center px-8 gap-6 md:hidden">
        {LINKS.map(l => (
          <a key={l.label} href={l.href} onClick={() => setOpen(false)}
             className="font-display text-3xl font-bold text-chalk
                        hover:text-gold-400 transition-colors duration-300">
            {l.label}
          </a>
        ))}
        <a href="https://wa.me/2347073495781"
           target="_blank" rel="noreferrer"
           className="mt-4 font-body text-[10px] tracking-[0.3em]
                      uppercase font-medium bg-gold-400 text-ink
                      px-5 py-4 text-center">
          Get a Quote
        </a>
      </motion.div>
    </nav>
  )
}