import { useState, useRef, useEffect } from 'react'
import { Search, Filter, User, LogOut, Plus, Menu, X, Moon, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate, Link } from 'react-router-dom'

const MONTHS = [
  { value: '', label: 'All months' },
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 2014 }, (_, i) => currentYear - i)

export default function Navbar({
  onSearch,
  onUploadClick,
  searchQuery,
  setSearchQuery,
  filterYear,
  filterMonth,
  onFilterChange,
}) {
  const { user, signOut, isAuthenticated } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
    navigate('/auth')
  }

  const hasActiveFilter = !!(filterYear || filterMonth)

  return (
    <nav className="sticky top-0 z-50 bg-[#fafaf8]/90 dark:bg-[#0c0c0c]/90 backdrop-blur-md border-b border-black/5 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-serif font-bold text-lg">
              M
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="font-serif font-semibold text-[15px] tracking-tight">Memento</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Editorial Archives
              </p>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search moments..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 text-sm placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
            />
          </form>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`p-2 rounded-full transition-colors ${
                  hasActiveFilter
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'
                }`}
                title="Filter"
              >
                <Filter className="w-5 h-5" />
              </button>

              {showFilter && (
                <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-auto sm:mt-2 w-auto sm:w-64 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-black/5 dark:border-white/10 p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Date Filter</p>
                    <button onClick={() => setShowFilter(false)} className="sm:hidden p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">Year</label>
                    <select
                      value={filterYear}
                      onChange={(e) =>
                        onFilterChange?.({
                          year: e.target.value,
                          month: e.target.value ? filterMonth : '',
                        })
                      }
                      className="w-full px-3 py-2 border border-black/10 dark:border-white/15 rounded-xl text-sm bg-transparent focus:outline-none dark:bg-[#1a1a1a]"
                    >
                      <option value="">All years</option>
                      {YEARS.map((y) => (
                        <option key={y} value={String(y)}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">Month</label>
                    <select
                      value={filterMonth}
                      onChange={(e) =>
                        onFilterChange?.({ year: filterYear, month: e.target.value })
                      }
                      disabled={!filterYear}
                      className="w-full px-3 py-2 border border-black/10 dark:border-white/15 rounded-xl text-sm bg-transparent focus:outline-none disabled:opacity-40 dark:bg-[#1a1a1a]"
                    >
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    {!filterYear && (
                      <p className="text-xs text-gray-400 mt-1">Select a year first to filter by month</p>
                    )}
                  </div>

                  {hasActiveFilter && (
                    <button
                      onClick={() => {
                        onFilterChange?.({ year: '', month: '' })
                        setShowFilter(false)
                      }}
                      className="w-full py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={toggle}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
              title="Toggle theme"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={onUploadClick}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Moment</span>
            </button>

            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-black/5 dark:border-white/10 py-2 z-50">
                    <div className="px-4 py-2 border-b border-black/5 dark:border-white/10">
                      <p className="text-sm font-medium truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search moments..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 text-sm placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:outline-none"
              />
            </form>
          </div>
        )}
      </div>
    </nav>
  )
}