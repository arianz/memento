import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const placeholderImages = [
  'https://picsum.photos/id/1015/400/500',
  'https://picsum.photos/id/1016/300/400',
  'https://picsum.photos/id/1018/350/450',
  'https://picsum.photos/id/1025/280/380',
  'https://picsum.photos/id/1035/320/420',
  'https://picsum.photos/id/1043/300/360',
]

export default function HeroSection() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleGetReady = () => {
    navigate(isAuthenticated ? '/gallery' : '/auth')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafaf8] dark:bg-[#0c0c0c]">
      <div className="absolute inset-0 opacity-25 dark:opacity-20">
        <div className="absolute top-10 left-4 sm:left-10 w-32 h-40 sm:w-48 sm:h-60 rounded-2xl overflow-hidden shadow-lg rotate-[-8deg] border-4 border-white dark:border-white/20">
          <img src={placeholderImages[0]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-20 right-8 sm:right-20 w-28 h-36 sm:w-40 sm:h-52 rounded-2xl overflow-hidden shadow-lg rotate-6 border-4 border-white dark:border-white/20">
          <img src={placeholderImages[1]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-32 left-8 sm:left-24 w-36 h-44 sm:w-52 sm:h-64 rounded-2xl overflow-hidden shadow-lg rotate-[4deg] border-4 border-white dark:border-white/20">
          <img src={placeholderImages[2]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-20 right-4 sm:right-16 w-44 h-56 rounded-2xl overflow-hidden shadow-lg rotate-[-5deg] border-4 border-white dark:border-white/20">
          <img src={placeholderImages[3]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-36 h-48 rounded-2xl overflow-hidden shadow-lg rotate-12 border-4 border-white dark:border-white/20 hidden sm:block">
          <img src={placeholderImages[4]} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-[#fafaf8] via-transparent to-[#fafaf8]/80 dark:from-[#0c0c0c] dark:to-[#0c0c0c]/80" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight mb-4"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          Memento
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Capture, collect, and cherish your precious moments.
        </p>
        <button
          onClick={handleGetReady}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black text-base font-medium rounded-full hover:opacity-90 transition-opacity"
        >
          Get ready
        </button>
      </div>
    </div>
  )
}