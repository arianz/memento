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

export default function LoginPage() {
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

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafaf8] dark:bg-[#0c0c0c]">
      <div className="absolute inset-0 opacity-25 dark:opacity-15">
        <div className="absolute top-10 left-4 sm:left-10 w-32 h-40 sm:w-48 sm:h-60 rounded-2xl overflow-hidden shadow-lg rotate-[-8deg] border-4 border-white dark:border-white/10">
          <img src={placeholderImages[0]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-20 right-8 sm:right-20 w-28 h-36 sm:w-40 sm:h-52 rounded-2xl overflow-hidden shadow-lg rotate-6 border-4 border-white dark:border-white/10">
          <img src={placeholderImages[1]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-32 left-8 sm:left-24 w-36 h-44 sm:w-52 sm:h-64 rounded-2xl overflow-hidden shadow-lg rotate-[4deg] border-4 border-white dark:border-white/10">
          <img src={placeholderImages[2]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-20 right-4 sm:right-16 w-44 h-56 rounded-2xl overflow-hidden shadow-lg rotate-[-5deg] border-4 border-white dark:border-white/10">
          <img src={placeholderImages[3]} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-[#fafaf8]/80 via-transparent to-[#fafaf8]/60 dark:from-[#0c0c0c]/90 dark:to-[#0c0c0c]/70" />

      <Link
        to="/"
        className="absolute top-5 left-5 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-sm transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 py-16 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        <div className="text-center lg:text-left max-w-md">
          <h1
            className="text-5xl sm:text-6xl font-medium mb-4"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Memento
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            {mode === 'login'
              ? 'Masuk untuk melihat dan mengunggah momenmu'
              : 'Buat akun untuk mulai menyimpan kenangan'}
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/15 rounded-3xl shadow-xl p-8 sm:p-10">
            <h2
              className="text-2xl font-medium text-center mb-6"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              {mode === 'login' ? 'Sign in' : 'Sign up'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl text-green-600 dark:text-green-300 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-black dark:bg-white text-white dark:text-black font-medium rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login')
                  setError('')
                  setSuccess('')
                }}
                className="text-black dark:text-white font-medium hover:underline"
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