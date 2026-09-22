import { useState } from 'react'
import Navbar from '../components/Navbar'
import EmptyState from '../components/EmptyState'
import ImageGrid from '../components/ImageGrid'
import UploadModal from '../components/UploadModal'
import { useImages } from '../hooks/useImages'
import { Loader2 } from 'lucide-react'

export default function GalleryPage() {
  const { images, loading, error, fetchImages, uploadImage, deleteImage } =
    useImages()

  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)

  const handleUploadClick = () => {
    setShowUploadModal(true)
  }

  const handleSearch = (query) => {
    fetchImages(query)
  }

  const handleUpload = async (data) => {
    await uploadImage(data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onSearch={handleSearch}
        onUploadClick={handleUploadClick}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
        ) : images.length === 0 ? (
          <EmptyState onUploadClick={handleUploadClick} />
        ) : (
          <ImageGrid images={images} onDelete={deleteImage} />
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