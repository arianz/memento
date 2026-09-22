import { useNavigate } from 'react-router-dom'

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

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Background collage */}
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

      <div className="absolute inset-0 bg-linear-to-t from-white/80 via-transparent to-white/60" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
          <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Memento
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
          Capture, collect, and cherish your precious moments.
          <br className="hidden sm:block" />
          A beautiful gallery for the memories that matter.
        </p>
        <button
          onClick={() => navigate('/gallery')}
          className="group relative inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-300 hover:-translate-y-0.5"
        >
          Get ready
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}