import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const placeholderImages = [
  'https://picsum.photos/id/1015/400/500',
  'https://picsum.photos/id/1016/300/400',
  'https://picsum.photos/id/1018/350/450',
  'https://picsum.photos/id/1025/280/380',
  'https://picsum.photos/id/1035/320/420',
  'https://picsum.photos/id/1043/300/360',
]

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
        navigate('/gallery')
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
        setSuccess('Akun berhasil dibuat! Silakan login.')
        setMode('login')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError('')
    setSuccess('')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-4 sm:left-10 w-32 h-40 sm:w-48 sm:h-60 rounded-2xl overflow-hidden shadow-lg rotate-[-8deg] border-4 border-white">
          <img src={placeholderImages[0]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-20 right-8 sm:right-20 w-28 h-36 sm:w-40 sm:h-52 rounded-2xl overflow-hidden shadow-lg rotate-6 border-4 border-white">
          <img src={placeholderImages[1]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-32 left-8 sm:left-24 w-36 h-44 sm:w-52 sm:h-64 rounded-2xl overflow-hidden shadow-lg rotate-[4deg] border-4 border-white">
          <img src={placeholderImages[2]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-20 right-4 sm:right-16 w-30 h-38 sm:w-44 sm:h-56 rounded-2xl overflow-hidden shadow-lg rotate-[-5deg] border-4 border-white">
          <img src={placeholderImages[3]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-24 h-32 sm:w-36 sm:h-48 rounded-2xl overflow-hidden shadow-lg rotate-12 border-4 border-white hidden sm:block">
          <img src={placeholderImages[4]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-40 left-1/3 w-28 h-36 rounded-2xl overflow-hidden shadow-lg rotate-[-10deg] border-4 border-white hidden lg:block">
          <img src={placeholderImages[5]} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-white/70 via-transparent to-white/50" />

      {/* ===== BACK BUTTON ===== */}
      <Link
        to="/"
        className="absolute top-5 left-5 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/70 hover:bg-white backdrop-blur-md border border-white/50 shadow-sm transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </Link>

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 py-16 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        
        {/* Left branding text */}
        <div className="text-center lg:text-left max-w-md">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Memento
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {mode === 'login'
              ? 'Masuk untuk melihat dan mengunggah momenmu'
              : 'Buat akun untuk mulai menyimpan kenangan'}
          </p>
        </div>

        {/* ===== FORM CARD (transparan) ===== */}
        <div className="w-full max-w-md">
          <div className="bg-black/60 backdrop-blur-l border border-white/60 rounded-3xl p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-200 text-center mb-6">
              {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50/90 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50/90 border border-green-100 rounded-xl text-green-600 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/70 border border-gray-200/80 rounded-xl text-gray-900 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-white/70 border border-gray-200/80 rounded-xl text-gray-900 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === 'login' ? 'SIGN IN' : 'SIGN UP'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-200">
              {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
              <button
                onClick={switchMode}
                className="text-blue-400 font-medium hover:underline"
              >
                {mode === 'login' ? 'Daftar' : 'Masuk'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}