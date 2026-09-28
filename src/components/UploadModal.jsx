import { useState, useRef } from 'react'
import { X, Upload, Image as ImageIcon, Loader2, Calendar } from 'lucide-react'
import exifr from 'exifr'

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState('')
  const [dateTaken, setDateTaken] = useState('')
  const [dateStatus, setDateStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return ''
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const extractDateFromImage = async (imageFile) => {
    try {
      const exif = await exifr.parse(imageFile, {
        pick: ['DateTimeOriginal', 'CreateDate', 'ModifyDate', 'DateTime'],
      })
      const rawDate =
        exif?.DateTimeOriginal ||
        exif?.CreateDate ||
        exif?.DateTime ||
        exif?.ModifyDate

      if (rawDate) {
        const formatted = formatDate(new Date(rawDate))
        if (formatted) {
          setDateTaken(formatted)
          setDateStatus('Tanggal berhasil dideteksi dari foto')
          return
        }
      }
      setDateTaken('')
      setDateStatus('Tanggal tidak ditemukan di metadata foto')
    } catch {
      setDateTaken('')
      setDateStatus('Tanggal tidak ditemukan di metadata foto')
    }
  }

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return
    if (!selectedFile.type.startsWith('image/')) {
      setError('Hanya file gambar yang diperbolehkan')
      return
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB')
      return
    }
    setError('')
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    if (!title) setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
    setDateTaken('')
    setDateStatus('Mendeteksi tanggal...')
    await extractDateFromImage(selectedFile)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files[0])
  }

  const resetForm = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setTitle('')
    setDescription('')
    setLocation('')
    setTags('')
    setDateTaken('')
    setDateStatus('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Pilih gambar terlebih dahulu')
      return
    }
    setLoading(true)
    setError('')
    try {
      let fullDescription = description.trim()
      if (dateTaken) {
        fullDescription = fullDescription
          ? `${fullDescription}\nDate taken on ${dateTaken}`
          : `Date taken on ${dateTaken}`
      }
      await onUpload({
        file,
        title,
        description: fullDescription,
        location,
        tags,
      })
      resetForm()
      onClose()
    } catch (err) {
      setError(err.message || 'Gagal mengunggah gambar')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-black/5 dark:border-white/10">
        <h2
          className="text-2xl font-medium mb-1 text-center"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          Add New Moment
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">
          Share a captured visual memory to your gallery.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-black dark:border-white bg-black/5 dark:bg-white/5'
                : preview
                  ? 'border-black/10 dark:border-white/15'
                  : 'border-black/15 dark:border-white/20 hover:border-black/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
            {preview ? (
              <div>
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                <p className="mt-2 text-xs text-gray-500">Klik untuk ganti gambar</p>
              </div>
            ) : (
              <div className="py-4">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                  <ImageIcon className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-sm font-medium">Drag & drop or click to select</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rainy Afternoon in Kyoto"
              className="w-full px-4 py-2.5 border border-black/10 dark:border-white/15 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the moment..."
              rows={3}
              className="w-full px-4 py-2.5 border border-black/10 dark:border-white/15 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Tokyo"
                className="w-full px-4 py-2.5 border border-black/10 dark:border-white/15 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Travel, Sunset"
                className="w-full px-4 py-2.5 border border-black/10 dark:border-white/15 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Date taken
            </label>
            <div className="flex items-center gap-2 px-4 py-2.5 border border-black/10 dark:border-white/15 rounded-xl bg-black/2 dark:bg-white/5 text-sm">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              {dateTaken ? (
                <span className="font-medium">Date taken on {dateTaken}</span>
              ) : (
                <span className="text-gray-400">{dateStatus || 'Select an image first'}</span>
              )}
            </div>
            {dateStatus && dateTaken && (
              <p className="mt-1.5 text-xs text-green-600 dark:text-green-400">{dateStatus}</p>
            )}
            {dateStatus && !dateTaken && file && (
              <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">{dateStatus}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 rounded-full border border-black/10 dark:border-white/15 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !file}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-full hover:opacity-90 disabled:opacity-50 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Publish Moment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}