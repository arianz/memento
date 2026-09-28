import { useState } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { X, Trash2, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function getDateLine(description) {
  if (!description) return null
  return description.split('\n').find((l) => l.startsWith('Date taken on ')) || null
}

function getStory(description) {
  if (!description) return ''
  return description
    .split('\n')
    .filter((line) => !line.startsWith('Date taken on '))
    .join('\n')
    .trim()
}

export default function ImageGrid({ images, onDelete }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const { user } = useAuth()

  if (!images || images.length === 0) return null

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl mx-auto">
        <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 750: 2, 900: 3, 1200: 4 }}>
          <Masonry gutter="16px">
            {images.map((image) => {
              const dateLine = getDateLine(image.description)
              const dateDisplay = dateLine ? dateLine.replace('Date taken on ', '').replace(/\//g, '-') : null
              return (
                <div
                  key={image.id}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => setSelectedImage(image)}
                >
                  {/* Image */}
                  <div className="overflow-hidden bg-gray-100 dark:bg-white/5">
                    <img
                      src={image.url}
                      alt={image.title || 'Gallery image'}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03] block"
                      loading="lazy"
                    />
                  </div>

                  {/* Footer card */}
                  <div className="px-3.5 py-3">
                    <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                      {image.title}
                    </p>
                    {dateDisplay && (
                      <p className="text-xs text-gray-400 mt-0.5">{dateDisplay}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </Masonry>
        </ResponsiveMasonry>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="
              relative w-full
              max-w-5xl
              h-[90vh] sm:h-auto sm:max-h-[90vh]
              bg-white dark:bg-[#141414]
              rounded-2xl overflow-hidden shadow-2xl
              flex flex-col md:flex-row
            "
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 md:bg-black/5 dark:md:bg-white/10 text-white md:text-current hover:bg-black/60 md:hover:bg-black/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="
                relative
                w-full md:w-[55%]
                h-[42vh] sm:h-[46vh] md:h-[min(85vh,640px)]
                shrink-0
                bg-[#111]
                flex items-center justify-center
              "
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
            </div>

            <div className="md:w-[45%] flex flex-col min-h-0 flex-1">
              <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8">
                <div className="flex items-start justify-between gap-3 mb-4 pr-5">
                  {selectedImage.tagsList?.length > 0 ? (
                    <span className="inline-block px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[11px] font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      {selectedImage.tagsList[0]}
                    </span>
                  ) : (
                    <span />
                  )}
                  {getDateLine(selectedImage.description) && (
                    <span className="text-xs text-gray-400 shrink-0">
                      {getDateLine(selectedImage.description).replace(
                        'Date taken on ',
                        ''
                      )}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2
                  className="text-2xl sm:text-3xl font-medium leading-tight mb-3"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  {selectedImage.title}
                </h2>

                {/* Description */}
                {getStory(selectedImage.description) && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5">
                    {getStory(selectedImage.description)}
                  </p>
                )}

                <div className="border-t border-black/5 dark:border-white/10 pt-4 space-y-3">
                  {selectedImage.location && (
                    <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      {selectedImage.location}
                    </p>
                  )}

                  {selectedImage.tagsList?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedImage.tagsList.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs text-gray-600 dark:text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Delete */}
              {user && selectedImage.user_id === user.id && onDelete && (
                <div className="shrink-0 border-t border-black/5 dark:border-white/10 p-4 sm:p-5">
                  <button
                    onClick={() => {
                      onDelete(selectedImage.id, selectedImage.storage_path)
                      setSelectedImage(null)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-red-200 dark:border-red-900/40"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}