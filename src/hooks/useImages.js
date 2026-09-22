import { useState, useEffect, useCallback } from 'react'
import { supabase, STORAGE_BUCKET, getPublicUrl } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useImages() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const fetchImages = useCallback(async (searchQuery = '') => {
    if (!user) {
      setImages([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (searchQuery.trim()) {
        query = query.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        )
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      const imagesWithUrls = (data || []).map((img) => ({
        ...img,
        url: getPublicUrl(img.storage_path),
      }))

      setImages(imagesWithUrls)
    } catch (err) {
      console.error('Error fetching images:', err)
      setError(err.message)
      setImages([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const uploadImage = async ({ file, title, description }) => {
    if (!user) {
      throw new Error('You must be logged in to upload images')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data, error: dbError } = await supabase
      .from('images')
      .insert({
        title: title || file.name,
        description: description || '',
        storage_path: fileName,
        user_id: user.id,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single()

    if (dbError) {
      await supabase.storage.from(STORAGE_BUCKET).remove([fileName])
      throw dbError
    }

    const newImage = {
      ...data,
      url: getPublicUrl(data.storage_path),
    }
    setImages((prev) => [newImage, ...prev])

    return newImage
  }

  const deleteImage = async (id, storagePath) => {
    if (!user) throw new Error('Not authenticated')

    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath])

    if (storageError) throw storageError

    const { error: dbError } = await supabase.from('images').delete().eq('id', id)

    if (dbError) throw dbError

    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  return {
    images,
    loading,
    error,
    fetchImages,
    uploadImage,
    deleteImage,
  }
}