export default function SectionTag({ children, dark = false }) {
  return (
    <div className={`flex items-center gap-3 mb-5
                     font-body text-[9.5px] tracking-[0.5em] uppercase
                     ${dark ? 'text-black/50' : 'text-gold-400'}`}>
      <span className={`block w-7 h-px
                        ${dark ? 'bg-black/30' : 'bg-gold-400'}`} />
      {children}
    </div>
  )
}