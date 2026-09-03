import { useState, useRef, useEffect } from 'react'
import { Link }                         from 'react-router-dom'
import { supabase }                     from '../lib/supabase'
import { gsap }                         from 'gsap'

const LOGO = new URL('../assets/logo/shamaro logo.png', import.meta.url).href

const STAGES = [
  { key: 'accepted',   label: 'Order Accepted',      desc: 'We have received your order.' },
  { key: 'proofing',   label: 'Design Proofing',     desc: 'We are reviewing and proofing your design.' },
  { key: 'production', label: 'In Production',       desc: 'Your order is being printed.' },
  { key: 'finishing',  label: 'Finishing & Cutting',  desc: 'Final touches and quality checks.' },
  { key: 'ready',      label: 'Ready',               desc: 'Your order is ready for pickup or dispatch.' },
  { key: 'delivered',  label: 'Delivered',           desc: 'Order successfully delivered.' },
]

export default function Track() {
  const [code,    setCode]    = useState('')
  const [order,   setOrder]   = useState(null)
  const [payment, setPayment] = useState(null)
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const resultRef             = useRef(null)
  const wrapRef               = useRef(null)

  useEffect(() => {
    gsap.fromTo(wrapRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
  }, [])

  useEffect(() => {
    if (order && resultRef.current) {
      gsap.fromTo(resultRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      )
    }
  }, [order])

  const handleTrack = async (e) => {
    e.preventDefault()
    setError('')
    setOrder(null)
    setLoading(true)

    const { data, error: err } = await supabase
      .from('orders')
      .select('*')
      .eq('order_code', code.toUpperCase().trim())
      .single()

    if (err || !data) {
      setError('Order not found. Please check your order code and try again.')
      setLoading(false)
      return
    }

    setOrder(data)

    // Fetch payment
    const { data: payData } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', data.id)
      .single()
    setPayment(payData)

    // Fetch items
    const { data: itemData } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', data.id)
    setItems(itemData || [])

    setLoading(false)
  }

  const stageIndex = order
    ? STAGES.findIndex(s => s.key === order.status)
    : -1

  return (
    <div className="min-h-screen paper-texture px-5 py-12">

      {/* Header */}
      <div className="max-w-xl mx-auto">
        <div className="mb-10 text-center">
          <Link to="/">
            <img src={LOGO} alt="Shamaro"
                 className="w-20 h-auto object-contain mx-auto mb-4" />
          </Link>
          <p className="font-body text-[9px] tracking-[0.5em]
                        uppercase text-dust">
            Order Tracker
          </p>
        </div>
      </div>

      <div ref={wrapRef} className="max-w-xl mx-auto opacity-0">

        {/* Search */}
        <div className="mb-10">
          <p className="font-body text-[9px] tracking-[0.5em]
                        uppercase text-gold-600 mb-3
                        flex items-center gap-2">
            <span className="w-4 h-px bg-gold-600" />
            Track Your Order
          </p>
          <h1 className="font-display font-black text-ink
                         text-3xl md:text-5xl uppercase
                         tracking-tight mb-8">
            Where is
            <br />
            <span style={{
              background:           'linear-gradient(135deg,#e8a921,#ca7312)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
            }}>
              your order?
            </span>
          </h1>

          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="e.g. SHA-2026-0001"
              required
              className="flex-1 px-4 py-3
                         bg-white border border-ink/15
                         font-body text-sm text-ink
                         placeholder:text-dust/40
                         focus:outline-none focus:border-gold-500
                         transition-colors duration-200
                         uppercase"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-ink text-chalk
                         font-body font-medium text-[10px]
                         tracking-[0.3em] uppercase flex-shrink-0
                         hover:bg-gold-400 hover:text-ink
                         transition-all duration-300
                         disabled:opacity-50"
            >
              {loading ? '...' : 'Track'}
            </button>
          </form>

          {error && (
            <p className="mt-3 font-body text-xs text-red-500">
              {error}
            </p>
          )}
        </div>

        {/* Result */}
        {order && (
          <div ref={resultRef} className="opacity-0 flex flex-col gap-5">

            {/* Order header */}
            <div className="p-5 bg-white/70 border border-ink/10">
              <div className="flex justify-between items-start mb-1">
                <p className="font-display font-black text-ink text-lg">
                  {order.order_code}
                </p>
                <span className="font-body text-[8px] tracking-[0.3em]
                                 uppercase px-2 py-1
                                 bg-gold-400/20 text-gold-700">
                  {STAGES[stageIndex]?.label || order.status}
                </span>
              </div>
              <p className="font-body text-[10px] text-dust">
                Placed {new Date(order.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>

            {/* Pipeline */}
            <div className="p-5 bg-white/70 border border-ink/10">
              <p className="font-body text-[9px] tracking-[0.4em]
                            uppercase text-dust mb-5">
                Production Pipeline
              </p>

              <div className="flex flex-col gap-0">
                {STAGES.map((stage, i) => {
                  const done    = i < stageIndex
                  const current = i === stageIndex
                  const future  = i > stageIndex

                  return (
                    <div key={stage.key}
                         className="flex gap-4 items-start">
                      {/* Connector */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-7 h-7 rounded-full border-2 flex
                                         items-center justify-center flex-shrink-0
                                         transition-all duration-500
                                         ${done
                                           ? 'border-gold-500 bg-gold-400'
                                           : current
                                             ? 'border-ink bg-ink'
                                             : 'border-dust/25 bg-transparent'
                                         }`}>
                          {done
                            ? <span className="text-ink text-xs font-bold">✓</span>
                            : current
                              ? <span className="w-2 h-2 rounded-full bg-chalk" />
                              : <span className="w-1.5 h-1.5 rounded-full bg-dust/25" />
                          }
                        </div>
                        {i < STAGES.length - 1 && (
                          <div className={`w-px flex-1 min-h-[28px] my-1
                                           transition-colors duration-500
                                           ${done ? 'bg-gold-400' : 'bg-ink/10'}`} />
                        )}
                      </div>

                      {/* Text */}
                      <div className="pb-4">
                        <p className={`font-body font-medium text-sm
                                       transition-colors duration-300
                                       ${done
                                         ? 'text-gold-600'
                                         : current
                                           ? 'text-ink'
                                           : 'text-dust/40'
                                       }`}>
                          {stage.label}
                        </p>
                        {(done || current) && (
                          <p className="font-body text-[10px] text-dust mt-0.5">
                            {stage.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Items */}
            {items.length > 0 && (
              <div className="p-5 bg-white/70 border border-ink/10">
                <p className="font-body text-[9px] tracking-[0.4em]
                              uppercase text-dust mb-4">
                  Items Ordered
                </p>
                <div className="flex flex-col gap-2">
                  {items.map(item => (
                    <div key={item.id}
                         className="flex justify-between items-center
                                    py-2 border-b border-ink/8 last:border-0">
                      <div>
                        <p className="font-body text-sm text-ink font-medium">
                          {item.product_type}
                        </p>
                        {item.notes && (
                          <p className="font-body text-[10px] text-dust">
                            {item.notes}
                          </p>
                        )}
                      </div>
                      <p className="font-body text-[10px] text-dust ml-4">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment */}
            {payment && (
              <div className="p-5 bg-white/70 border border-ink/10">
                <p className="font-body text-[9px] tracking-[0.4em]
                              uppercase text-dust mb-4">
                  Payment Summary
                </p>

                {[
                  { label: 'Total Amount',    value: payment.total_amount   > 0 ? `₦${payment.total_amount.toLocaleString()}` : 'Pending confirmation' },
                  { label: 'Deposit Paid',    value: payment.deposit_amount > 0 ? `₦${payment.deposit_amount.toLocaleString()}` : '—' },
                  { label: 'Balance Remaining', value: payment.balance_amount > 0 ? `₦${payment.balance_amount.toLocaleString()}` : '—' },
                ].map(d => (
                  <div key={d.label}
                       className="flex justify-between py-2
                                  border-b border-ink/8 last:border-0">
                    <p className="font-body text-[10px] text-dust">
                      {d.label}
                    </p>
                    <p className="font-body text-[10px] text-ink font-medium">
                      {d.value}
                    </p>
                  </div>
                ))}

                {/* Payment status badge */}
                <div className="mt-4 flex justify-end">
                  <span className={`font-body text-[8px] tracking-[0.3em]
                                    uppercase px-3 py-1.5
                                    ${payment.payment_status === 'fully_paid'
                                      ? 'bg-green-100 text-green-700'
                                      : payment.payment_status === 'deposit_paid'
                                        ? 'bg-gold-400/20 text-gold-700'
                                        : 'bg-red-50 text-red-500'
                                    }`}>
                    {payment.payment_status === 'fully_paid'   ? 'Fully Paid'
                     : payment.payment_status === 'deposit_paid' ? 'Deposit Paid'
                     : 'Payment Pending'}
                  </span>
                </div>
              </div>
            )}

            {/* WhatsApp follow-up */}
            <a
              href={`https://wa.me/2347073495781?text=Hi Shamaro! I'd like to follow up on my order ${order.order_code}.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3
                         w-full py-4 border border-ink/15
                         font-body text-[10px] tracking-[0.35em] uppercase
                         text-dust hover:border-gold-400 hover:text-gold-600
                         transition-all duration-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M11.999 2C6.478 2 2 6.478 2 12c0 1.85.504 3.58 1.38 5.063L2 22l5.084-1.329A9.955 9.955 0 0012 22c5.522 0 10-4.478 10-10S17.522 2 12 2z"/>
              </svg>
              Follow up on WhatsApp
            </a>
          </div>
        )}

        {/* No account prompt */}
        {!order && !loading && (
          <div className="text-center pt-4">
            <p className="font-body text-xs text-dust/60 mb-3">
              Have an account? Sign in for full order history.
            </p>
            <Link to="/login"
                  className="font-body text-[9px] tracking-[0.4em]
                             uppercase text-gold-600 hover:text-ink
                             transition-colors duration-200">
              Sign In →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}