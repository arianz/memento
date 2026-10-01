import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight } from 'lucide-react'

const CARDS = [
  {
    id: 1,
    img: 'https://picsum.photos/id/1015/400/480',
    title: 'Golden Hour',
    date: '12-03-2024',
  },
  {
    id: 2,
    img: 'https://picsum.photos/id/1018/400/480',
    title: 'Quiet Pier',
    date: '28-07-2023',
  },
  {
    id: 3,
    img: 'https://picsum.photos/id/1035/400/480',
    title: 'Forest Walk',
    date: '04-11-2025',
  },
  {
    id: 4,
    img: 'https://picsum.photos/id/1043/400/480',
    title: 'City Lights',
    date: '19-01-2024',
  },
  {
    id: 5,
    img: 'https://picsum.photos/id/1025/400/480',
    title: 'Morning Dew',
    date: '08-09-2025',
  },
]

export default function HeroSection() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleExplore = () => {
    navigate(isAuthenticated ? '/gallery' : '/auth')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafaf8] dark:bg-[#0c0c0c]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 min-h-screen flex items-center">
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center py-24 lg:py-0">

          <div
            className="
              pointer-events-none
              absolute inset-0 flex items-center justify-center
              opacity-[0.35] sm:opacity-40
              lg:opacity-100 lg:pointer-events-auto
              lg:relative lg:inset-auto
              lg:order-2
              z-0
            "
          >
            <div className="orbit-stage relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px]">
              {CARDS.map((card, i) => {
                const start = (i * 360) / CARDS.length
                return (
                  <div
                    key={card.id}
                    className="orbit-item absolute top-1/2 left-1/2"
                    style={{ ['--start']: `${start}deg` }}
                  >
                    <div className="polaroid bg-white/90 dark:bg-[#1a1a1a]/90 p-1.5 sm:p-2 pb-2 sm:pb-3 rounded-lg shadow-md border border-black/5 dark:border-white/10 w-[88px] sm:w-[110px] lg:w-[120px]">
                      <div className="aspect-4/5 rounded-md overflow-hidden bg-gray-100 dark:bg-white/5 mb-1.5">
                        <img
                          src={card.img}
                          alt={card.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-medium text-gray-800 dark:text-gray-100 truncate px-0.5">
                        {card.title}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 px-0.5">
                        {card.date}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative z-10 text-center lg:text-left lg:order-1">
            <div className="relative">
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-gray-900 dark:text-white mb-5"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                Memento
                <span className="text-amber-500">.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">
                Capture, collect, and cherish your precious moments.
              </p>
              <button
                onClick={handleExplore}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-black dark:bg-white text-white dark:text-black text-sm font-medium tracking-wide uppercase rounded-full hover:opacity-90 transition-opacity shadow-lg"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .orbit-item {
          --radius: 130px;
          transform:
            translate(-50%, -50%)
            rotate(var(--start))
            translateY(calc(var(--radius) * -1));
          animation: spin-ring 40s linear infinite;
        }

        @media (min-width: 640px) {
          .orbit-item { --radius: 130px; }
        }
        @media (min-width: 1024px) {
          .orbit-item { --radius: 165px; }
        }

        @keyframes spin-ring {
          from {
            transform:
              translate(-50%, -50%)
              rotate(var(--start))
              translateY(calc(var(--radius) * -1));
          }
          to {
            transform:
              translate(-50%, -50%)
              rotate(calc(var(--start) + 360deg))
              translateY(calc(var(--radius) * -1));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .orbit-item { animation: none; }
        }
      `}</style>
    </div>
  )
}