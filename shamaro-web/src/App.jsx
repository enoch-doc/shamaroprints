import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect }      from 'react'
import { supabase }                 from './lib/supabase'
import { logActivity, updateLastSeen } from './lib/activity'
import Loader                       from './components/ui/Loader'
import Home                         from './pages/Home'
import Login                        from './pages/Login'
import Register                     from './pages/Register'
import Order                        from './pages/Order'
import Track                        from './pages/Track'
import Dashboard                    from './pages/Dashboard'
import Admin                        from './pages/Admin'

export default function App() {
  const [loading,  setLoading]  = useState(true)
  const [appReady, setAppReady] = useState(false)
  const [session,  setSession]  = useState(null)
  const [role,     setRole]     = useState(null)

  useEffect(() => {
    // Get existing session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchRole(session.user.id)
        updateLastSeen(session.user.id)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        if (session) {
          fetchRole(session.user.id)
          updateLastSeen(session.user.id)
          logActivity(session.user.id, 'login')
        } else {
          setRole(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
  }, [])

  const fetchRole = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    if (data) setRole(data.role)
  }

  const handleLoadDone = () => {
    setAppReady(true)
    document.body.style.overflow = ''
  }

  // Protected route wrapper
  const Protected = ({ children, adminOnly = false }) => {
    if (!session) return <Navigate to="/login" replace />
    if (adminOnly && role !== 'admin') {
      return <Navigate to="/dashboard" replace />
    }
    return children
  }

  return (
    <>
      {loading && (
        <Loader onComplete={() => {
          setLoading(false)
          handleLoadDone()
        }} />
      )}

      {appReady && (
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order"    element={<Order session={session} />} />
          <Route path="/track"    element={<Track />} />

          {/* Protected — client */}
          <Route path="/dashboard" element={
            <Protected>
              <Dashboard session={session} role={role} />
            </Protected>
          } />

          {/* Protected — admin only */}
          <Route path="/admin" element={
            <Protected adminOnly>
              <Admin session={session} />
            </Protected>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  )
}