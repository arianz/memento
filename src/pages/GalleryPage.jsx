import { useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import EmptyState from '../components/EmptyState'
import ImageGrid from '../components/ImageGrid'
import UploadModal from '../components/UploadModal'
import { useImages } from '../hooks/useImages'
import { Loader2 } from 'lucide-react'

function parseDateTaken(description) {
  if (!description) return null
  const line = description.split('\n').find((l) => l.startsWith('Date taken on '))
  if (!line) return null
  const dateStr = line.replace('Date taken on ', '').trim()
  const [day, month, year] = dateStr.split('/')
  if (!day || !month || !year) return null
  return { day, month, year }
}

export default function GalleryPage() {
  const { images, loading, error, fetchImages, uploadImage, deleteImage } = useImages()
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [filterYear, setFilterYear] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [activeTag, setActiveTag] = useState('All')

  const handleUploadClick = () => setShowUploadModal(true)
  const handleSearch = (query) => fetchImages(query)
  const handleUpload = async (data) => uploadImage(data)
  const handleFilterChange = ({ year, month }) => {
    setFilterYear(year || '')
    setFilterMonth(month || '')
  }

  const tagOptions = useMemo(() => {
    const fromData = new Set()
    images.forEach((img) => {
      ;(img.tagsList || []).forEach((t) => fromData.add(t))
    })
    return ['All', ...Array.from(fromData).sort((a, b) => a.localeCompare(b))]
  }, [images])

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const parsed = parseDateTaken(img.description)
      if (filterYear && (!parsed || parsed.year !== filterYear)) return false
      if (filterMonth && (!parsed || parsed.month !== filterMonth)) return false

      if (activeTag && activeTag !== 'All') {
        const tags = (img.tagsList || []).map((t) => t.toLowerCase())
        if (!tags.includes(activeTag.toLowerCase())) return false
      }
      return true
    })
  }, [images, filterYear, filterMonth, activeTag])

  const uniqueYears = useMemo(() => {
    const years = new Set()
    images.forEach((img) => {
      const parsed = parseDateTaken(img.description)
      if (parsed?.year) years.add(parsed.year)
    })
    return years.size
  }, [images])

  const isSearchOrFilter =
    searchQuery.trim() || filterYear || filterMonth || (activeTag && activeTag !== 'All')

  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#0c0c0c]">
      <Navbar
        onSearch={handleSearch}
        onUploadClick={handleUploadClick}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterYear={filterYear}
        filterMonth={filterMonth}
        onFilterChange={handleFilterChange}
      />

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
              <h1
                className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-medium tracking-tight leading-[1.15] mb-4"
              >
                Capture, collect &amp; cherish moments.
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl">
                An organic, distraction-free archive built to display life&apos;s quiet
                highlights with calm elegance and editorial craftsmanship.
              </p>
            </div>

            <div className="flex items-center justify-center lg:justify-end gap-6 shrink-0">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-semibold tabular-nums">{images.length || '-'}</p>
                <p className="text-[11px] uppercase tracking-wider text-gray-400">Moments</p>
              </div>
              <div className="w-px h-10 bg-black/20 dark:bg-stone-500" />
              <div className="text-center lg:text-left">
                <p className="text-2xl font-semibold tabular-nums">{uniqueYears || '-'}</p>
                <p className="text-[11px] uppercase tracking-wider text-gray-400">Years</p>
              </div>
            </div>
          </div>

          <div className="mt-8 mb-4 border-t border-black/20 dark:border-stone-500" />

          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-thin">
            {tagOptions.map((tag) => {
              const active = activeTag === tag
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/15'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
            <span className="ml-auto shrink-0 text-xs font-medium text-gray-400 hidden sm:inline">
              Showing {filteredImages.length}{' '}
              {filteredImages.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => fetchImages()}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm"
            >
              Coba lagi
            </button>
          </div>
        ) : filteredImages.length === 0 ? (
          <EmptyState
            onUploadClick={handleUploadClick}
            variant={isSearchOrFilter ? 'search' : 'empty'}
          />
        ) : (
          <ImageGrid
            images={filteredImages}
            onDelete={deleteImage}
          />
        )}
      </main>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  )
}