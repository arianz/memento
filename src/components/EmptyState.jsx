import { Upload, SearchX, ImageOff } from 'lucide-react'

export default function EmptyState({ onUploadClick, variant = 'empty' }) {
  if (variant === 'search') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center mb-6">
          <SearchX className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
        </div>
        <h3
          className="text-xl font-medium mb-2"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          No results found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
          No images were found that match your search or filters.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center mb-6">
        <ImageOff className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
      </div>
      <h3
        className="text-xl font-medium mb-2"
        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
      >
        No moments yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
        Upload your first visual memory to begin your archive.
      </p>
      <button
        onClick={onUploadClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-full hover:opacity-90 transition-opacity"
      >
        <Upload className="w-4 h-4" />
        Add first moment
      </button>
    </div>
  )
}