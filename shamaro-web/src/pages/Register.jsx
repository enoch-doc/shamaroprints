import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate }            from 'react-router-dom'
import { supabase }                     from '../lib/supabase'
import { gsap }                         from 'gsap'

const LOGO = new URL('../assets/logo/shamaro logo.png', import.meta.url).href

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    email:     '',
    phone:     '',
    password:  '',
    confirm:   '',
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()
  const formRef               = useRef(null)
  const logoRef               = useRef(null)

  useEffect(() => {
    gsap.fromTo(logoRef.current,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
    gsap.fromTo(formRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8,
        delay: 0.2, ease: 'power3.out' }
    )
  }, [])

  const update = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
     if (!form.phone) {
    setError('Phone number is required for order updates.')
    return
  }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email:    form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Save phone to profile
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ phone: form.phone })
        .eq('id', user.id)
    }

    navigate('/dashboard')
  }

  const fields = [
    { key: 'full_name', label: 'Full Name',        type: 'text',     placeholder: 'Your full name' },
    { key: 'email',     label: 'Email Address',    type: 'email',    placeholder: 'you@example.com' },
    { key: 'phone',     label: 'Phone Number',     type: 'tel',      placeholder: '+234 000 000 0000' },
    { key: 'password',  label: 'Password',         type: 'password', placeholder: '8+ characters' },
    { key: 'confirm',   label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
  ]

  return (
    <div className="min-h-screen paper-texture
                    flex flex-col items-center justify-center
                    px-5 py-12">

      {/* Logo */}
      <div ref={logoRef} className="mb-10 opacity-0">
        <Link to="/">
          <img
            src={LOGO}
            alt="Shamaro"
            className="w-24 h-auto object-contain mx-auto"
          />
        </Link>
        <p className="font-body text-[9px] tracking-[0.5em]
                      uppercase text-dust text-center mt-3">
          Printing Enterprise
        </p>
      </div>

      {/* Card */}
      <div
        ref={formRef}
        className="w-full max-w-sm bg-white/60
                   border border-ink/8 p-8 opacity-0"
      >
        <div className="mb-8">
          <p className="font-body text-[9px] tracking-[0.5em]
                        uppercase text-gold-600 mb-2
                        flex items-center gap-2">
            <span className="w-4 h-px bg-gold-600" />
            New client
          </p>
          <h1 className="font-display font-black text-ink
                         text-3xl uppercase tracking-tight">
            Create Account
          </h1>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200">
            <p className="font-body text-xs text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {fields.map(f => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <label className="font-body text-[9px] tracking-[0.4em]
                                uppercase text-dust">
                {f.label}
              </label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={update(f.key)}
                required
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2
                       bg-ink text-chalk
                       font-body font-medium text-[10px]
                       tracking-[0.35em] uppercase
                       hover:bg-gold-400 hover:text-ink
                       transition-all duration-300
                       disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-xs text-dust">
          Already have an account?{' '}
          <Link to="/login"
                className="text-gold-600 hover:text-ink
                           transition-colors duration-200 font-medium">
            Sign in
          </Link>
        </p>
      </div>

      <Link to="/"
            className="mt-8 font-body text-[9px] tracking-[0.4em]
                       uppercase text-dust/50 hover:text-dust
                       transition-colors duration-200
                       flex items-center gap-2">
        <span className="w-4 h-px bg-dust/30" />
        Back to Home
      </Link>
    </div>
  )
}