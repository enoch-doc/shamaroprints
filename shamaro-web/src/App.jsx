import { useState, useEffect } from 'react'
import { Routes, Route }       from 'react-router-dom'
import Loader                  from './components/ui/Loader'
import Home                    from './pages/Home'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
  }, [])

  const handleDone = () => {
    setLoading(false)
    document.body.style.overflow = ''
  }

  return (
    <>
      {loading && <Loader onComplete={handleDone} />}
      {!loading && (
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      )}
    </>
  )
}