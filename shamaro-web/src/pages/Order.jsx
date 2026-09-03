import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate,
         useSearchParams }              from 'react-router-dom'
import { supabase }                    from '../lib/supabase'
import { gsap }                        from 'gsap'

const LOGO = new URL('../assets/logo/shamaro logo.png', import.meta.url).href

// ── Product catalogue ──
const CATALOGUE = {
  events: [
    { id: 'banner',   name: 'Event Banner',    desc: 'Vinyl banners for events, conferences, and celebrations.', unit: 'per piece' },
    { id: 'backdrop', name: 'Photo Backdrop',  desc: 'Large format backdrops for photo opportunities.',          unit: 'per piece' },
    { id: 'tag',      name: 'ID / Name Tags',  desc: 'Printed tags for staff, volunteers, and attendees.',       unit: 'per 10' },
    { id: 'poster',   name: 'Event Poster',    desc: 'A3/A2 printed posters for event promotion.',               unit: 'per piece' },
    { id: 'tshirt',   name: 'Event T-Shirts',  desc: 'Branded tees for your team or attendees.',                 unit: 'per piece' },
  ],
  graduation: [
    { id: 'jotter',   name: 'Convocation Jotter', desc: 'Custom cover notebooks for graduation gifts.',          unit: 'per piece' },
    { id: 'tshirt',   name: 'Graduation Tee',     desc: 'Custom printed tees marking the milestone.',            unit: 'per piece' },
    { id: 'hoodie',   name: 'Graduation Hoodie',  desc: 'Premium hoodies with custom prints.',                   unit: 'per piece' },
    { id: 'bottle',   name: 'Custom Bottle',      desc: 'Personalized water bottles as gifts.',                  unit: 'per piece' },
    { id: 'cap',      name: 'Graduation Cap',     desc: 'Branded caps for the celebration.',                     unit: 'per piece' },
  ],
  induction: [
    { id: 'jotter',   name: 'Induction Jotter',   desc: 'Professional notebooks with custom cover design.',      unit: 'per piece' },
    { id: 'award',    name: 'Wooden Award',        desc: 'Mahogany plaques with gold engraving.',                 unit: 'per piece' },
    { id: 'glass',    name: 'Glass Trophy',        desc: 'Elegant glass awards for distinguished recipients.',    unit: 'per piece' },
    { id: 'mug',      name: 'Custom Mug',          desc: 'Ceramic mugs with personalized print.',                 unit: 'per piece' },
    { id: 'bottle',   name: 'Custom Bottle',       desc: 'Personalized stainless steel bottles.',                 unit: 'per piece' },
    { id: 'nametag',  name: 'Name Tags',           desc: 'Professional name tags for the ceremony.',             unit: 'per 10' },
  ],
  brand: [
    { id: 'tshirt',   name: 'Branded T-Shirt',    desc: 'Custom tees carrying your brand identity.',             unit: 'per piece' },
    { id: 'hoodie',   name: 'Branded Hoodie',      desc: 'Premium hoodies for your team.',                       unit: 'per piece' },
    { id: 'jersey',   name: 'Custom Jersey',       desc: 'Sports jerseys with names and numbers.',               unit: 'per piece' },
    { id: 'cap',      name: 'Branded Cap',         desc: 'Embroidered or printed caps.',                         unit: 'per piece' },
    { id: 'banner',   name: 'Brand Banner',        desc: 'Rollup or vinyl banners for your business.',           unit: 'per piece' },
  ],
  appreciation: [
    { id: 'award',    name: 'Wooden Award',        desc: 'Mahogany plaques with gold engraving.',                 unit: 'per piece' },
    { id: 'glass',    name: 'Glass Trophy',        desc: 'Crystal glass trophies for top performers.',           unit: 'per piece' },
    { id: 'mug',      name: 'Custom Mug',          desc: 'Appreciation mugs with personal message.',             unit: 'per piece' },
    { id: 'bottle',   name: 'Custom Bottle',       desc: 'Premium bottles as thank-you gifts.',                  unit: 'per piece' },
    { id: 'jotter',   name: 'Gift Jotter',         desc: 'Personalised journals as appreciation gifts.',         unit: 'per piece' },
  ],
  others: [
    { id: 'tshirt',   name: 'T-Shirt',             desc: 'Custom printed t-shirts.',     unit: 'per piece' },
    { id: 'jotter',   name: 'Jotter/Notebook',     desc: 'Custom cover notebooks.',      unit: 'per piece' },
    { id: 'award',    name: 'Award/Plaque',         desc: 'Wooden or glass awards.',      unit: 'per piece' },
    { id: 'mug',      name: 'Mug',                 desc: 'Printed ceramic mugs.',        unit: 'per piece' },
    { id: 'bottle',   name: 'Bottle',              desc: 'Custom water bottles.',        unit: 'per piece' },
    { id: 'banner',   name: 'Banner/Poster',       desc: 'Large format print.',          unit: 'per piece' },
    { id: 'hoodie',   name: 'Hoodie',              desc: 'Custom hoodies.',              unit: 'per piece' },
    { id: 'cap',      name: 'Cap',                 desc: 'Printed or embroidered caps.', unit: 'per piece' },
    { id: 'jersey',   name: 'Jersey',              desc: 'Sports jerseys.',              unit: 'per piece' },
  ],
}

const INTENT_LABELS = {
  events:       'For Events & Celebrations',
  graduation:   'For Graduation & Convocation',
  induction:    'For Induction Ceremony',
  brand:        'For My Brand or Business',
  appreciation: 'For Appreciation & Awards',
  others:       'Something Else',
}

const STEPS = ['Category', 'Products', 'Details', 'Review']

export default function Order({ session }) {
  const [searchParams]              = useSearchParams()
  const navigate                    = useNavigate()
  const intentFromURL               = searchParams.get('intent') || 'others'

  const [step,       setStep]       = useState(0)
  const [intent,     setIntent]     = useState(intentFromURL)
  const [cart,       setCart]       = useState([])
  const [details,    setDetails]    = useState({
    full_name:  session?.user?.user_metadata?.full_name || '',
    email:      session?.user?.email || '',
    phone:      '',
    deadline:   '',
    notes:      '',
    designFile: null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [orderCode,  setOrderCode]  = useState('')
  const [done,       setDone]       = useState(false)
  const wrapRef                     = useRef(null)

  useEffect(() => {
    gsap.fromTo(wrapRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    )
  }, [step])

  // ── Cart helpers ──
  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) return prev
      return [...prev, { ...product, quantity: 1, notes: '' }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  const updateCart = (id, field, value) => {
    setCart(prev => prev.map(i =>
      i.id === id ? { ...i, [field]: value } : i
    ))
  }

  const inCart = (id) => cart.some(i => i.id === id)

  // ── Submit order ──
  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      // 1. Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id:         session?.user?.id || null,
          client_name:     details.full_name,
          client_email:    details.email,
          client_phone:    details.phone,
          intent_category: intent,
          notes:           details.notes,
          status:          'accepted',
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Create order items
      const items = cart.map(item => ({
        order_id:     order.id,
        product_type: item.name,
        description:  item.desc,
        quantity:     parseInt(item.quantity) || 1,
        notes:        item.notes,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(items)

      if (itemsError) throw itemsError

      // 3. Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id:       order.id,
          total_amount:   0,  // admin will update this
          deposit_amount: 0,
          payment_status: 'unpaid',
        })

      if (paymentError) throw paymentError

      // 4. Upload design file if provided
      if (details.designFile && session?.user?.id) {
        const file = details.designFile
        const path = `${session.user.id}/${order.id}/${file.name}`
        await supabase.storage
          .from('designs')
          .upload(path, file)
      }

      setOrderCode(order.order_code)
      setDone(true)

    } catch (err) {
      console.error('Order failed:', err)
      alert('Something went wrong. Please try again or contact us on WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ──
  if (done) {
    return (
      <div className="min-h-screen dark-texture
                      flex flex-col items-center justify-center
                      px-5 text-center">
        <div
          className="w-12 h-px bg-gold-400 mx-auto mb-8"
          style={{ boxShadow: '0 0 12px rgba(253,191,0,0.6)' }}
        />
        <p className="font-body text-[9px] tracking-[0.5em]
                      uppercase text-gold-500 mb-4">
          Order Received
        </p>
        <h1 className="font-display font-black text-chalk
                       text-4xl md:text-6xl uppercase
                       tracking-tight mb-4">
          You're all set.
        </h1>
        <p className="font-serif italic text-fog/70
                      text-lg mb-8 max-w-md">
          We've received your order and will be in touch shortly
          to confirm details and pricing.
        </p>

        {/* Order code */}
        <div className="bg-ink-3 border border-gold-400/20
                        px-8 py-5 mb-8">
          <p className="font-body text-[9px] tracking-[0.4em]
                        uppercase text-dust mb-2">
            Your Order Code
          </p>
          <p className="font-display font-black text-gold-400
                        text-2xl tracking-widest">
            {orderCode}
          </p>
          <p className="font-body text-[9px] text-dust/60 mt-2">
            Save this code to track your order
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/track"
                className="px-8 py-3 bg-gold-400 text-ink
                           font-body font-medium text-[10px]
                           tracking-[0.3em] uppercase
                           hover:bg-gold-500 transition-colors">
            Track Order
          </Link>
          <a href={`https://wa.me/2347073495781?text=Hi Shamaro! I just placed an order. My order code is ${orderCode}.`}
             target="_blank"
             rel="noreferrer"
             className="px-8 py-3 border border-white/15 text-dust
                        font-body text-[10px] tracking-[0.3em] uppercase
                        hover:border-gold-400 hover:text-gold-400
                        transition-all duration-300">
            Follow up on WhatsApp
          </a>
          <Link to="/"
                className="px-8 py-3 border border-white/15 text-dust
                           font-body text-[10px] tracking-[0.3em] uppercase
                           hover:border-gold-400 hover:text-gold-400
                           transition-all duration-300">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const products = CATALOGUE[intent] || CATALOGUE.others

  return (
    <div className="min-h-screen paper-texture">

      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-chalk/95
                      backdrop-blur-md border-b border-ink/8
                      px-5 md:px-10 h-16
                      flex items-center justify-between">
        <Link to="/">
          <img src={LOGO} alt="Shamaro"
               className="h-8 w-auto object-contain" />
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-1 md:gap-3">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-1 md:gap-3">
              <div className={`flex items-center gap-1.5
                              font-body text-[8px] md:text-[9px]
                              tracking-[0.3em] uppercase
                              transition-colors duration-300
                              ${i === step
                                ? 'text-ink'
                                : i < step
                                  ? 'text-gold-600'
                                  : 'text-dust/40'
                              }`}>
                <span className={`w-5 h-5 rounded-full
                                  flex items-center justify-center
                                  text-[8px] font-bold border
                                  transition-all duration-300
                                  ${i === step
                                    ? 'border-ink bg-ink text-chalk'
                                    : i < step
                                      ? 'border-gold-600 bg-gold-400 text-ink'
                                      : 'border-dust/20 text-dust/30'
                                  }`}>
                  {i < step ? '✓' : i + 1}
                </span>
                <span className="hidden md:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <span className="w-4 md:w-8 h-px bg-ink/10" />
              )}
            </div>
          ))}
        </div>

        <div className="w-8 md:w-24" /> {/* Spacer */}
      </div>

      {/* Step content */}
      <div ref={wrapRef} className="max-w-3xl mx-auto
                                    px-5 md:px-8 py-10 md:py-16">

        {/* ── STEP 0 — Category ── */}
        {step === 0 && (
          <div>
            <p className="font-body text-[9px] tracking-[0.5em]
                          uppercase text-gold-600 mb-3
                          flex items-center gap-2">
              <span className="w-4 h-px bg-gold-600" />
              Step 1 of 4
            </p>
            <h2 className="font-display font-black text-ink
                           text-3xl md:text-5xl uppercase
                           tracking-tight mb-2">
              What are you
            </h2>
            <h2 className="font-display font-black
                           text-3xl md:text-5xl uppercase
                           tracking-tight mb-10"
                style={{
                  background:           'linear-gradient(135deg,#e8a921,#ca7312)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                }}>
              ordering for?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(INTENT_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setIntent(key)}
                  className={`p-5 border text-left
                              transition-all duration-300
                              ${intent === key
                                ? 'border-gold-500 bg-gold-400'
                                : 'border-ink/10 bg-white/60 hover:border-gold-500/50'
                              }`}
                >
                  <span className={`block font-body text-[9px]
                                    tracking-[0.3em] uppercase mb-2
                                    ${intent === key
                                      ? 'text-ink/50' : 'text-gold-600'}`}>
                    {String(Object.keys(INTENT_LABELS).indexOf(key) + 1)
                      .padStart(2, '0')}
                  </span>
                  <span className={`block font-display font-bold
                                    text-base leading-tight
                                    ${intent === key
                                      ? 'text-ink' : 'text-ink'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(1)}
                className="px-10 py-4 bg-ink text-chalk
                           font-body font-medium text-[10px]
                           tracking-[0.35em] uppercase
                           hover:bg-gold-400 hover:text-ink
                           transition-all duration-300"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1 — Products ── */}
        {step === 1 && (
          <div>
            <p className="font-body text-[9px] tracking-[0.5em]
                          uppercase text-gold-600 mb-3
                          flex items-center gap-2">
              <span className="w-4 h-px bg-gold-600" />
              Step 2 of 4
            </p>
            <h2 className="font-display font-black text-ink
                           text-3xl md:text-5xl uppercase
                           tracking-tight mb-2">
              Choose your
            </h2>
            <h2 className="font-display font-black
                           text-3xl md:text-5xl uppercase
                           tracking-tight mb-2"
                style={{
                  background:           'linear-gradient(135deg,#e8a921,#ca7312)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                }}>
              products
            </h2>
            <p className="font-body text-xs text-dust mb-8">
              {INTENT_LABELS[intent]} · Select all that apply
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {products.map(p => (
                <div
                  key={p.id}
                  className={`border p-5 transition-all duration-300
                              ${inCart(p.id)
                                ? 'border-gold-500 bg-gold-400/10'
                                : 'border-ink/10 bg-white/60'
                              }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-display font-bold text-ink
                                    text-sm leading-tight">
                        {p.name}
                      </p>
                      <p className="font-body text-[10px] text-dust mt-1">
                        {p.desc}
                      </p>
                      <p className="font-body text-[9px] text-gold-600
                                    mt-1 uppercase tracking-wider">
                        Priced {p.unit}
                      </p>
                    </div>

                    <button
                      onClick={() => inCart(p.id)
                        ? removeFromCart(p.id)
                        : addToCart(p)
                      }
                      className={`ml-3 flex-shrink-0 w-7 h-7
                                  border flex items-center justify-center
                                  font-bold text-sm transition-all duration-200
                                  ${inCart(p.id)
                                    ? 'border-gold-600 bg-gold-400 text-ink'
                                    : 'border-ink/20 text-dust hover:border-ink'
                                  }`}
                    >
                      {inCart(p.id) ? '✓' : '+'}
                    </button>
                  </div>

                  {/* Quantity + notes when in cart */}
                  {inCart(p.id) && (
                    <div className="mt-3 pt-3 border-t border-ink/10
                                    flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <label className="font-body text-[9px]
                                          tracking-[0.3em] uppercase text-dust">
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={cart.find(i => i.id === p.id)?.quantity || 1}
                          onChange={e =>
                            updateCart(p.id, 'quantity', e.target.value)
                          }
                          className="w-16 px-2 py-1 border border-ink/15
                                     font-body text-sm text-ink text-center
                                     focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Special notes for this item..."
                        value={cart.find(i => i.id === p.id)?.notes || ''}
                        onChange={e =>
                          updateCart(p.id, 'notes', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-ink/15
                                   font-body text-xs text-ink
                                   placeholder:text-dust/40
                                   focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="bg-gold-400/10 border border-gold-400/30
                              p-4 mb-6">
                <p className="font-body text-[9px] tracking-[0.3em]
                              uppercase text-gold-600">
                  {cart.length} product{cart.length > 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(0)}
                      className="px-6 py-3 border border-ink/15 text-dust
                                 font-body text-[10px] tracking-[0.3em] uppercase
                                 hover:border-ink hover:text-ink
                                 transition-all duration-300">
                ← Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={cart.length === 0}
                className="px-10 py-4 bg-ink text-chalk
                           font-body font-medium text-[10px]
                           tracking-[0.35em] uppercase
                           hover:bg-gold-400 hover:text-ink
                           transition-all duration-300
                           disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 — Details ── */}
        {step === 2 && (
          <div>
            <p className="font-body text-[9px] tracking-[0.5em]
                          uppercase text-gold-600 mb-3
                          flex items-center gap-2">
              <span className="w-4 h-px bg-gold-600" />
              Step 3 of 4
            </p>
            <h2 className="font-display font-black text-ink
                           text-3xl md:text-5xl uppercase
                           tracking-tight mb-2">
              Your
            </h2>
            <h2 className="font-display font-black
                           text-3xl md:text-5xl uppercase
                           tracking-tight mb-10"
                style={{
                  background:           'linear-gradient(135deg,#e8a921,#ca7312)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                }}>
              details
            </h2>

            <div className="flex flex-col gap-5">

              {[
                { key: 'full_name', label: 'Full Name',     type: 'text',  placeholder: 'Your full name',        required: true  },
                { key: 'email',     label: 'Email Address', type: 'email', placeholder: 'you@example.com',        required: true  },
                { key: 'phone',     label: 'Phone Number',  type: 'tel',   placeholder: '+234 000 000 0000',      required: true  },
                { key: 'deadline',  label: 'When do you need it?', type: 'date', placeholder: '', required: false },
              ].map(f => (
                <div key={f.key} className="flex flex-col gap-1.5">
                  <label className="font-body text-[9px] tracking-[0.4em]
                                    uppercase text-dust">
                    {f.label}
                    {f.required && <span className="text-gold-600 ml-1">*</span>}
                  </label>
                  <input
                    type={f.type}
                    value={details[f.key]}
                    onChange={e =>
                      setDetails(prev => ({ ...prev, [f.key]: e.target.value }))
                    }
                    required={f.required}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3
                               bg-white border border-ink/15
                               font-body text-sm text-ink
                               placeholder:text-dust/50
                               focus:outline-none focus:border-gold-500
                               transition-colors duration-200"
                  />
                </div>
              ))}

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[9px] tracking-[0.4em]
                                  uppercase text-dust">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  value={details.notes}
                  onChange={e =>
                    setDetails(prev => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Any specific requirements, colour preferences, text to print..."
                  className="w-full px-4 py-3 resize-none
                             bg-white border border-ink/15
                             font-body text-sm text-ink
                             placeholder:text-dust/50
                             focus:outline-none focus:border-gold-500
                             transition-colors duration-200"
                />
              </div>

              {/* Design upload */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[9px] tracking-[0.4em]
                                  uppercase text-dust">
                  Upload Design File
                  <span className="text-dust/40 ml-1 normal-case
                                   tracking-normal">
                    (optional — PNG, JPG, PDF, AI, CDR)
                  </span>
                </label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf,.ai,.cdr,.svg"
                  onChange={e =>
                    setDetails(prev => ({
                      ...prev,
                      designFile: e.target.files[0] || null,
                    }))
                  }
                  className="w-full px-4 py-3
                             bg-white border border-ink/15
                             font-body text-sm text-dust
                             file:mr-4 file:py-1 file:px-4
                             file:border-0 file:bg-ink
                             file:text-chalk file:text-[9px]
                             file:tracking-widest file:uppercase
                             file:cursor-pointer
                             focus:outline-none"
                />
                {!session && (
                  <p className="font-body text-[9px] text-dust/50 italic">
                    Note: file upload requires an account.{' '}
                    <Link to="/register"
                          className="text-gold-600 hover:underline">
                      Create one free
                    </Link>
                    {' '}or send your design via WhatsApp after ordering.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(1)}
                      className="px-6 py-3 border border-ink/15 text-dust
                                 font-body text-[10px] tracking-[0.3em] uppercase
                                 hover:border-ink hover:text-ink
                                 transition-all duration-300">
                ← Back
              </button>
              <button
                onClick={() => {
                  if (!details.full_name || !details.email || !details.phone) {
                    alert('Please fill in your name, email, and phone number.')
                    return
                  }
                  setStep(3)
                }}
                className="px-10 py-4 bg-ink text-chalk
                           font-body font-medium text-[10px]
                           tracking-[0.35em] uppercase
                           hover:bg-gold-400 hover:text-ink
                           transition-all duration-300"
              >
                Review Order →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 — Review ── */}
        {step === 3 && (
          <div>
            <p className="font-body text-[9px] tracking-[0.5em]
                          uppercase text-gold-600 mb-3
                          flex items-center gap-2">
              <span className="w-4 h-px bg-gold-600" />
              Step 4 of 4
            </p>
            <h2 className="font-display font-black text-ink
                           text-3xl md:text-5xl uppercase
                           tracking-tight mb-2">
              Review your
            </h2>
            <h2 className="font-display font-black
                           text-3xl md:text-5xl uppercase
                           tracking-tight mb-10"
                style={{
                  background:           'linear-gradient(135deg,#e8a921,#ca7312)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                }}>
              order
            </h2>

            {/* Order summary */}
            <div className="flex flex-col gap-4 mb-8">

              {/* Intent */}
              <div className="p-5 bg-white/60 border border-ink/10">
                <p className="font-body text-[9px] tracking-[0.4em]
                              uppercase text-dust mb-1">
                  Order Type
                </p>
                <p className="font-display font-bold text-ink text-base">
                  {INTENT_LABELS[intent]}
                </p>
              </div>

              {/* Products */}
              <div className="p-5 bg-white/60 border border-ink/10">
                <p className="font-body text-[9px] tracking-[0.4em]
                              uppercase text-dust mb-3">
                  Products ({cart.length})
                </p>
                <div className="flex flex-col gap-3">
                  {cart.map(item => (
                    <div key={item.id}
                         className="flex justify-between items-start
                                    pb-3 border-b border-ink/8 last:border-0 last:pb-0">
                      <div>
                        <p className="font-display font-bold text-ink text-sm">
                          {item.name}
                        </p>
                        {item.notes && (
                          <p className="font-body text-[10px] text-dust mt-0.5">
                            {item.notes}
                          </p>
                        )}
                      </div>
                      <p className="font-body text-[10px] tracking-[0.3em]
                                    uppercase text-dust ml-4 flex-shrink-0">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client details */}
              <div className="p-5 bg-white/60 border border-ink/10">
                <p className="font-body text-[9px] tracking-[0.4em]
                              uppercase text-dust mb-3">
                  Your Details
                </p>
                {[
                  { label: 'Name',     value: details.full_name },
                  { label: 'Email',    value: details.email     },
                  { label: 'Phone',    value: details.phone     },
                  { label: 'Deadline', value: details.deadline || 'Not specified' },
                ].map(d => (
                  <div key={d.label}
                       className="flex justify-between py-1.5
                                  border-b border-ink/5 last:border-0">
                    <p className="font-body text-[10px] text-dust">{d.label}</p>
                    <p className="font-body text-[10px] text-ink font-medium">
                      {d.value}
                    </p>
                  </div>
                ))}
                {details.notes && (
                  <div className="mt-3 pt-3 border-t border-ink/8">
                    <p className="font-body text-[9px] tracking-[0.3em]
                                  uppercase text-dust mb-1">
                      Notes
                    </p>
                    <p className="font-body text-xs text-ink/70">
                      {details.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Pricing note */}
              <div className="p-4 bg-gold-400/10 border border-gold-400/30">
                <p className="font-body text-[10px] text-gold-700 leading-relaxed">
                  Pricing will be confirmed by Shamaro after reviewing
                  your order. A deposit will be required before production begins.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)}
                      className="px-6 py-3 border border-ink/15 text-dust
                                 font-body text-[10px] tracking-[0.3em] uppercase
                                 hover:border-ink hover:text-ink
                                 transition-all duration-300">
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-10 py-4 bg-ink text-chalk
                           font-body font-medium text-[10px]
                           tracking-[0.35em] uppercase
                           hover:bg-gold-400 hover:text-ink
                           transition-all duration-300
                           disabled:opacity-50"
              >
                {submitting ? 'Placing order...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}