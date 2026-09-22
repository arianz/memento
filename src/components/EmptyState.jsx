import { Upload } from 'lucide-react'

export default function EmptyState({ onUploadClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
        <Upload className="w-12 h-12 text-indigo-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Belum ada gambar
      </h3>
      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
        Keterangan belum ada gambar. Upload gambar supaya bisa ditampilkan di
        gallery.
      </p>
      <button
        onClick={onUploadClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
      >
        <Upload className="w-4 h-4" />
        Upload gambar pertama
      </button>
    </div>
  )
}