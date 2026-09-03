import { useEffect, useState }          from 'react'
import { useNavigate, Link }            from 'react-router-dom'
import { supabase, getUserOrders,
         getNotifications }             from '../lib/supabase'

const LOGO = new URL('../assets/logo/shamaro logo.png', import.meta.url).href

const STAGE_LABELS = {
  accepted:   'Order Accepted',
  proofing:   'Design Proofing',
  production: 'In Production',
  finishing:  'Finishing',
  ready:      'Ready',
  delivered:  'Delivered',
}

const STAGE_COLORS = {
  accepted:   'bg-blue-50   text-blue-600',
  proofing:   'bg-purple-50 text-purple-600',
  production: 'bg-yellow-50 text-yellow-600',
  finishing:  'bg-orange-50 text-orange-600',
  ready:      'bg-green-50  text-green-600',
  delivered:  'bg-gray-100  text-gray-500',
}

export default function Dashboard({ session }) {
  const navigate                       = useNavigate()
  const [profile,  setProfile]         = useState(null)
  const [orders,   setOrders]          = useState([])
  const [notifs,   setNotifs]          = useState([])
  const [loading,  setLoading]         = useState(true)
  const [tab,      setTab]             = useState('orders')
  const [unread,   setUnread]          = useState(0)
  const [saving,   setSaving]          = useState(false)
  const [saved,    setSaved]           = useState(false)
  const [form,     setForm]            = useState({
    full_name: '', phone: '', city: '', state: '',
  })

  useEffect(() => {
    if (!session) { navigate('/login'); return }
    loadAll()
  }, [session])

  const loadAll = async () => {
    setLoading(true)
    const userId = session.user.id

    const { data: p } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(p)
    setForm({
      full_name: p?.full_name || '',
      phone:     p?.phone     || '',
      city:      p?.city      || '',
      state:     p?.state     || '',
    })

    const o = await getUserOrders(userId)
    setOrders(o)

    const n = await getNotifications(userId)
    setNotifs(n)
    setUnread(n.filter(x => !x.read).length)

    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const markAllRead = async () => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', session.user.id)
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    setUnread(0)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    await supabase
      .from('profiles')
      .update(form)
      .eq('id', session.user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    loadAll()
  }

  if (loading) {
    return (
      <div className="min-h-screen paper-texture
                      flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img src={LOGO} alt="Shamaro"
               className="w-16 h-auto animate-pulse" />
          <p className="font-body text-[9px] tracking-[0.4em]
                        uppercase text-dust">
            Loading...
          </p>
        </div>
      </div>
    )
  }

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

        <div className="flex items-center gap-4">
          {/* Notification bell */}
          <button
            onClick={() => {
              setTab('notifications')
              markAllRead()
            }}
            className="relative p-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor"
                 strokeWidth="1.5" className="text-dust">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            {unread > 0 && (
              <span className="absolute top-1 right-1
                               w-4 h-4 bg-gold-400 rounded-full
                               flex items-center justify-center
                               font-body font-bold text-[8px] text-ink">
                {unread}
              </span>
            )}
          </button>

          <p className="font-body text-xs text-dust hidden md:block">
            {profile?.full_name || session.user.email}
          </p>

          <button
            onClick={handleSignOut}
            className="font-body text-[9px] tracking-[0.3em]
                       uppercase text-dust hover:text-ink
                       transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10">

        {/* Welcome */}
        <div className="mb-10">
          <p className="font-body text-[9px] tracking-[0.5em]
                        uppercase text-gold-600 mb-2
                        flex items-center gap-2">
            <span className="w-4 h-px bg-gold-600" />
            Client Dashboard
          </p>
          <h1 className="font-display font-black text-ink
                         text-3xl md:text-5xl uppercase
                         tracking-tight leading-none">
            Welcome back,
            <br />
            <span style={{
              background:           'linear-gradient(135deg,#e8a921,#ca7312)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
            }}>
              {profile?.full_name?.split(' ')[0] || 'there'}.
            </span>
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
          {[
            { label: 'Total Orders',  value: orders.length },
            { label: 'Active',
              value: orders.filter(o =>
                !['delivered'].includes(o.status)
              ).length },
            { label: 'Delivered',
              value: orders.filter(o =>
                o.status === 'delivered'
              ).length },
            { label: 'Unread',        value: unread },
          ].map(s => (
            <div key={s.label}
                 className="bg-white/70 border border-ink/8 p-4">
              <p className="font-display font-black text-ink
                             text-2xl md:text-3xl leading-none">
                {s.value}
              </p>
              <p className="font-body text-[9px] tracking-[0.3em]
                             uppercase text-dust mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 border-b border-ink/8
                        overflow-x-auto">
          {[
            { key: 'orders',        label: 'My Orders'    },
            { key: 'notifications', label: `Notifications${unread > 0 ? ` (${unread})` : ''}` },
            { key: 'profile',       label: 'Profile'      },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 font-body text-[9px]
                          tracking-[0.3em] uppercase whitespace-nowrap
                          border-b-2 -mb-px
                          transition-all duration-200
                          ${tab === t.key
                            ? 'border-gold-600 text-ink'
                            : 'border-transparent text-dust hover:text-ink'
                          }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div className="flex flex-col gap-3">
            {orders.length === 0 ? (
              <div className="text-center py-20
                              border border-ink/8 bg-white/40">
                <p className="font-serif italic text-dust text-lg mb-2">
                  No orders yet.
                </p>
                <p className="font-body text-xs text-dust/60 mb-8">
                  Place your first order and it will appear here.
                </p>
                <Link to="/order"
                      className="inline-block px-8 py-3
                                 bg-ink text-chalk
                                 font-body text-[9px] tracking-[0.3em]
                                 uppercase hover:bg-gold-400
                                 hover:text-ink transition-all duration-300">
                  Place Your First Order
                </Link>
              </div>
            ) : (
              orders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            )}

            {orders.length > 0 && (
              <div className="mt-4 text-center">
                <Link to="/order"
                      className="inline-block px-8 py-3
                                 border border-ink/15 text-dust
                                 font-body text-[9px] tracking-[0.3em]
                                 uppercase hover:border-gold-400
                                 hover:text-gold-600
                                 transition-all duration-300">
                  + Place New Order
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── NOTIFICATIONS TAB ── */}
        {tab === 'notifications' && (
          <div className="flex flex-col gap-2">
            {notifs.length === 0 ? (
              <div className="text-center py-20 border border-ink/8
                              bg-white/40">
                <p className="font-serif italic text-dust text-lg">
                  No notifications yet.
                </p>
                <p className="font-body text-xs text-dust/60 mt-2">
                  You'll be notified here when your order status changes.
                </p>
              </div>
            ) : (
              notifs.map(n => (
                <div key={n.id}
                     className={`p-4 border flex gap-4 items-start
                                 ${n.read
                                   ? 'border-ink/8 bg-white/40'
                                   : 'border-gold-400/30 bg-gold-400/5'
                                 }`}>
                  <div className={`w-8 h-8 flex-shrink-0 rounded-full
                                   flex items-center justify-center
                                   ${n.type === 'order'
                                     ? 'bg-gold-400/20'
                                     : 'bg-ink/5'
                                   }`}>
                    <svg width="14" height="14" viewBox="0 0 24 24"
                         fill="none" stroke="#ca7312" strokeWidth="2">
                      <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-sm text-ink">
                      {n.title}
                    </p>
                    <p className="font-body text-xs text-dust mt-0.5
                                   leading-relaxed">
                      {n.message}
                    </p>
                    <p className="font-body text-[9px] text-dust/50 mt-1">
                      {new Date(n.created_at).toLocaleDateString('en-GB', {
                        day:    'numeric',
                        month:  'short',
                        hour:   '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 bg-gold-400 rounded-full
                                    flex-shrink-0 mt-1" />
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === 'profile' && (
          <form onSubmit={handleSaveProfile}
                className="max-w-md flex flex-col gap-4">

            {[
              { key: 'full_name', label: 'Full Name',    type: 'text' },
              { key: 'phone',     label: 'Phone Number', type: 'tel'  },
              { key: 'city',      label: 'City',         type: 'text' },
              { key: 'state',     label: 'State',        type: 'text' },
            ].map(f => (
              <div key={f.key} className="flex flex-col gap-1.5">
                <label className="font-body text-[9px] tracking-[0.4em]
                                  uppercase text-dust">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e =>
                    setForm(prev => ({ ...prev, [f.key]: e.target.value }))
                  }
                  className="w-full px-4 py-3
                             bg-white border border-ink/15
                             font-body text-sm text-ink
                             focus:outline-none focus:border-gold-500
                             transition-colors duration-200"
                />
              </div>
            ))}

            {/* Email — read only */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[9px] tracking-[0.4em]
                                uppercase text-dust">
                Email Address
              </label>
              <input
                type="email"
                value={session.user.email}
                readOnly
                className="w-full px-4 py-3
                           bg-ink/5 border border-ink/8
                           font-body text-sm text-dust
                           cursor-not-allowed"
              />
              <p className="font-body text-[9px] text-dust/50 italic">
                Email cannot be changed here.
              </p>
            </div>

            {/* Referral code */}
            {profile?.referral_code && (
              <div className="p-4 bg-gold-400/10 border border-gold-400/25">
                <p className="font-body text-[9px] tracking-[0.4em]
                              uppercase text-dust mb-1">
                  Your Referral Code
                </p>
                <p className="font-display font-black text-gold-600
                               text-lg tracking-widest">
                  {profile.referral_code}
                </p>
                <p className="font-body text-[9px] text-dust/60 mt-1">
                  Share with friends to refer them to Shamaro.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 mt-2
                         bg-ink text-chalk
                         font-body font-medium text-[10px]
                         tracking-[0.35em] uppercase
                         hover:bg-gold-400 hover:text-ink
                         transition-all duration-300
                         disabled:opacity-50"
            >
              {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

/* ── Order card ── */
function OrderCard({ order }) {
  const payment = order.payments?.[0]
  const items   = order.order_items || []

  return (
    <div className="bg-white/70 border border-ink/8 p-5">
      <div className="flex flex-col sm:flex-row
                      sm:items-center justify-between gap-3 mb-4">
        <div>
          <p className="font-display font-black text-ink
                         text-lg tracking-tight">
            {order.order_code}
          </p>
          <p className="font-body text-[10px] text-dust mt-0.5">
            {new Date(order.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
        <span className={`self-start sm:self-auto
                          px-3 py-1.5 rounded-full
                          font-body text-[8px] tracking-[0.3em] uppercase
                          ${STAGE_COLORS[order.status] || 'bg-gray-100 text-gray-500'}`}>
          {STAGE_LABELS[order.status] || order.status}
        </span>
      </div>

      {/* Items preview */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {items.slice(0, 3).map(item => (
            <span key={item.id}
                  className="font-body text-[9px] tracking-[0.2em]
                             uppercase px-2 py-1 bg-ink/5 text-dust">
              {item.product_type} ×{item.quantity}
            </span>
          ))}
          {items.length > 3 && (
            <span className="font-body text-[9px] text-dust/50">
              +{items.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Payment */}
      {payment && (
        <div className="flex flex-wrap gap-6 py-3
                        border-t border-ink/8">
          {payment.total_amount > 0 ? (
            <>
              <div>
                <p className="font-body text-[8px] tracking-[0.3em]
                               uppercase text-dust">Total</p>
                <p className="font-body text-sm font-medium text-ink">
                  ₦{Number(payment.total_amount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="font-body text-[8px] tracking-[0.3em]
                               uppercase text-dust">Deposit Paid</p>
                <p className="font-body text-sm font-medium text-ink">
                  ₦{Number(payment.deposit_amount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="font-body text-[8px] tracking-[0.3em]
                               uppercase text-dust">Balance</p>
                <p className={`font-body text-sm font-medium
                               ${Number(payment.balance_amount) > 0
                                 ? 'text-red-500'
                                 : 'text-green-600'}`}>
                  ₦{Number(payment.balance_amount).toLocaleString()}
                </p>
              </div>
            </>
          ) : (
            <p className="font-body text-[10px] text-dust/60 italic">
              Pricing being confirmed by Shamaro.
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-ink/5">
        <Link to={`/track?code=${order.order_code}`}
              className="px-4 py-2 bg-ink text-chalk
                         font-body text-[9px] tracking-[0.3em]
                         uppercase hover:bg-gold-400 hover:text-ink
                         transition-all duration-300">
          Track Order
        </Link>
        <a href={`https://wa.me/2347073495781?text=Hi Shamaro! Following up on order ${order.order_code}.`}
           target="_blank"
           rel="noreferrer"
           className="px-4 py-2 border border-ink/15 text-dust
                      font-body text-[9px] tracking-[0.3em]
                      uppercase hover:border-gold-400
                      hover:text-gold-600
                      transition-all duration-300">
          WhatsApp
        </a>
      </div>
    </div>
  )
}