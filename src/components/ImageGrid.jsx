import { useState } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { X, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ImageGrid({ images, onDelete }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const { user } = useAuth()

  if (!images || images.length === 0) return null

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 750: 2, 900: 3, 1200: 4 }}>
          <Masonry gutter="12px">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow bg-gray-100"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.title || 'Gallery image'}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02] block"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end">
                  <div className="p-3 opacity-0 group-hover:opacity-100 transition-opacity w-full bg-linear-to-t from-black/70 to-transparent rounded-b-xl">
                    <p className="text-white text-sm font-medium truncate">{image.title}</p>
                    {image.description && (
                      <p className="text-white/80 text-xs truncate mt-0.5">
                        {image.description
                          .split('\n')
                          .filter((line) => !line.startsWith('Date taken on '))
                          .join(' ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-h-[65vh] w-auto object-contain rounded-lg"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-lg font-semibold">{selectedImage.title}</h3>

              {selectedImage.description && (
                <p className="text-white/70 text-sm mt-1 whitespace-pre-line">
                  {selectedImage.description
                    .split('\n')
                    .filter((line) => !line.startsWith('Date taken on '))
                    }
                </p>
              )}

              {selectedImage.description?.includes('Date taken on ') && (
                <p className="text-white/90 text-sm mt-2 font-medium">
                  {selectedImage.description
                    .split('\n')
                    .find((line) => line.startsWith('Date taken on '))}
                </p>
              )}

              {user && selectedImage.user_id === user.id && onDelete && (
                <button
                  onClick={() => {
                    onDelete(selectedImage.id, selectedImage.storage_path)
                    setSelectedImage(null)
                  }}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-full text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}