import { useState, useRef, useEffect } from 'react'
import { Search, Filter, User, LogOut, Upload, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const MONTHS = [
  { value: '', label: 'Semua bulan' },
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
    navigate('/login')
  }

  const hasActiveFilter = filterYear || filterMonth

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Memento
              </span>
            </a>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search moments..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`p-2 rounded-full transition-colors relative ${
                  hasActiveFilter
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Filter"
              >
                <Filter className="w-5 h-5" />
                {hasActiveFilter && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full" />
                )}
              </button>

              {showFilter && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-50">
                  <p className="text-sm font-semibold text-gray-800 mb-3">
                    Filter tanggal
                  </p>

                  {/* Tahun */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Tahun
                    </label>
                    <select
                      value={filterYear}
                      onChange={(e) =>
                        onFilterChange?.({
                          year: e.target.value,
                          month: e.target.value ? filterMonth : '',
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Semua tahun</option>
                      {YEARS.map((y) => (
                        <option key={y} value={String(y)}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bulan */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Bulan
                    </label>
                    <select
                      value={filterMonth}
                      onChange={(e) =>
                        onFilterChange?.({
                          year: filterYear,
                          month: e.target.value,
                        })
                      }
                      disabled={!filterYear}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    {!filterYear && (
                      <p className="text-xs text-gray-400 mt-1">
                        Pilih tahun dulu untuk filter bulan
                      </p>
                    )}
                  </div>

                  {/* Reset */}
                  {hasActiveFilter && (
                    <button
                      onClick={() => {
                        onFilterChange?.({ year: '', month: '' })
                        setShowFilter(false)
                      }}
                      className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Reset filter
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Upload button */}
            <button
              onClick={onUploadClick}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>

            {/* Profile */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search moments..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>
        )}
      </div>
    </nav>
  )
}