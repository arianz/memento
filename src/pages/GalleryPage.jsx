import { useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import EmptyState from '../components/EmptyState'
import ImageGrid from '../components/ImageGrid'
import UploadModal from '../components/UploadModal'
import { useImages } from '../hooks/useImages'
import { Loader2 } from 'lucide-react'

// Ambil dd/mm/yyyy dari description
function parseDateTaken(description) {
  if (!description) return null
  const line = description
    .split('\n')
    .find((l) => l.startsWith('Date taken on '))
  if (!line) return null

  const dateStr = line.replace('Date taken on ', '').trim()
  const [day, month, year] = dateStr.split('/')
  if (!day || !month || !year) return null
  return { day, month, year }
}

export default function GalleryPage() {
  const { images, loading, error, fetchImages, uploadImage, deleteImage } =
    useImages()

  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [filterYear, setFilterYear] = useState('')
  const [filterMonth, setFilterMonth] = useState('')

  const handleUploadClick = () => {
    setShowUploadModal(true)
  }

  const handleSearch = (query) => {
    fetchImages(query)
  }

  const handleUpload = async (data) => {
    await uploadImage(data)
  }

  const handleFilterChange = ({ year, month }) => {
    setFilterYear(year || '')
    setFilterMonth(month || '')
  }

  // Filter gambar berdasarkan tahun & bulan
  const filteredImages = useMemo(() => {
    if (!filterYear && !filterMonth) return images

    return images.filter((img) => {
      const parsed = parseDateTaken(img.description)
      if (!parsed) return false

      if (filterYear && parsed.year !== filterYear) return false
      if (filterMonth && parsed.month !== filterMonth) return false

      return true
    })
  }, [images, filterYear, filterMonth])

  return (
    <div className="min-h-screen bg-gray-50">
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
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => fetchImages()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm"
            >
              Coba lagi
            </button>
          </div>
        ) : filteredImages.length === 0 ? (
          <EmptyState onUploadClick={handleUploadClick} />
        ) : (
          <ImageGrid images={filteredImages} onDelete={deleteImage} />
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