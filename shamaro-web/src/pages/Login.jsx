import { useState }        from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase }        from '../lib/supabase'
import { gsap }            from 'gsap'
import { useEffect, useRef } from 'react'

const LOGO = new URL('../assets/logo/shamaro logo.png', import.meta.url).href

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate                = useNavigate()
  const formRef                 = useRef(null)
  const logoRef                 = useRef(null)

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

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Check role and redirect accordingly
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

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
        {/* Heading */}
        <div className="mb-8">
          <p className="font-body text-[9px] tracking-[0.5em]
                        uppercase text-gold-600 mb-2
                        flex items-center gap-2">
            <span className="w-4 h-px bg-gold-600" />
            Welcome back
          </p>
          <h1 className="font-display font-black text-ink
                         text-3xl uppercase tracking-tight">
            Sign In
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200">
            <p className="font-body text-xs text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-[9px] tracking-[0.4em]
                              uppercase text-dust">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3
                         bg-white border border-ink/15
                         font-body text-sm text-ink
                         placeholder:text-dust/50
                         focus:outline-none focus:border-gold-500
                         transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-[9px] tracking-[0.4em]
                              uppercase text-dust">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3
                         bg-white border border-ink/15
                         font-body text-sm text-ink
                         placeholder:text-dust/50
                         focus:outline-none focus:border-gold-500
                         transition-colors duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2
                       bg-ink text-chalk
                       font-body font-medium text-[10px]
                       tracking-[0.35em] uppercase
                       hover:bg-gold-400 hover:text-ink
                       transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-ink/8" />
          <span className="font-body text-[9px] tracking-widest
                           uppercase text-dust/50">
            or
          </span>
          <span className="flex-1 h-px bg-ink/8" />
        </div>

        {/* Track without account */}
        <Link
          to="/track"
          className="block w-full py-3 text-center
                     border border-ink/15
                     font-body text-[10px] tracking-[0.3em]
                     uppercase text-dust
                     hover:border-gold-500 hover:text-ink
                     transition-all duration-300"
        >
          Track Order Without Login
        </Link>

        {/* Register link */}
        <p className="mt-6 text-center font-body text-xs text-dust">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-gold-600 hover:text-ink
                       transition-colors duration-200 font-medium"
          >
            Create one
          </Link>
        </p>
      </div>

      {/* Back to home */}
      <Link
        to="/"
        className="mt-8 font-body text-[9px] tracking-[0.4em]
                   uppercase text-dust/50
                   hover:text-dust transition-colors duration-200
                   flex items-center gap-2"
      >
        <span className="w-4 h-px bg-dust/30" />
        Back to Home
      </Link>
    </div>
  )
}