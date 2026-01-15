'use client'

import { useCallback, useState, useRef } from 'react'
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  // Start with maximum possible square crop
  const isLandscape = mediaWidth > mediaHeight
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        // Use 100% of the smaller dimension to maximize crop area
        width: isLandscape ? (mediaHeight / mediaWidth) * 100 : 100,
        height: isLandscape ? 100 : (mediaWidth / mediaHeight) * 100,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

export default function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Crop state
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const imgRef = useRef<HTMLImageElement>(null)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [currentFileIndex, setCurrentFileIndex] = useState(0)

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }

  const getCroppedImg = async (): Promise<Blob | null> => {
    if (!imgRef.current || !crop) return null

    const image = imgRef.current
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const pixelCrop = {
      x: (crop.x / 100) * image.width * scaleX,
      y: (crop.y / 100) * image.height * scaleY,
      width: (crop.width / 100) * image.width * scaleX,
      height: (crop.height / 100) * image.height * scaleY,
    }

    // Output size (max 1200px)
    const outputSize = Math.min(1200, pixelCrop.width, pixelCrop.height)
    canvas.width = outputSize
    canvas.height = outputSize

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputSize,
      outputSize
    )

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        'image/jpeg',
        0.9
      )
    })
  }

  const uploadCroppedImage = async () => {
    setUploading(true)
    setError(null)

    try {
      const croppedBlob = await getCroppedImg()
      if (!croppedBlob) {
        throw new Error('Failed to crop image')
      }

      const formData = new FormData()
      formData.append('file', croppedBlob, 'cropped.jpg')
      formData.append('folder', 'products')

      const res = await fetch(`${API_URL}/api/admin/images/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success && data.url) {
        onChange([...images, data.url])
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Upload failed. Check connection.')
    } finally {
      setUploading(false)

      // Process next file if any
      const nextIndex = currentFileIndex + 1
      if (nextIndex < pendingFiles.length) {
        setCurrentFileIndex(nextIndex)
        const nextFile = pendingFiles[nextIndex]
        const reader = new FileReader()
        reader.onload = () => {
          setImageToCrop(reader.result as string)
          setCrop(undefined)
        }
        reader.readAsDataURL(nextFile)
      } else {
        // Done with all files
        setCropModalOpen(false)
        setImageToCrop(null)
        setPendingFiles([])
        setCurrentFileIndex(0)
      }
    }
  }

  const skipCurrentImage = () => {
    const nextIndex = currentFileIndex + 1
    if (nextIndex < pendingFiles.length) {
      setCurrentFileIndex(nextIndex)
      const nextFile = pendingFiles[nextIndex]
      const reader = new FileReader()
      reader.onload = () => {
        setImageToCrop(reader.result as string)
        setCrop(undefined)
      }
      reader.readAsDataURL(nextFile)
    } else {
      setCropModalOpen(false)
      setImageToCrop(null)
      setPendingFiles([])
      setCurrentFileIndex(0)
    }
  }

  const openCropModal = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image`)
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`${file.name} is too large (max 10MB)`)
        return false
      }
      return true
    })

    if (fileArray.length === 0) return

    if (images.length + fileArray.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    setError(null)
    setPendingFiles(fileArray)
    setCurrentFileIndex(0)

    // Load first file
    const reader = new FileReader()
    reader.onload = () => {
      setImageToCrop(reader.result as string)
      setCropModalOpen(true)
    }
    reader.readAsDataURL(fileArray[0])
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    openCropModal(e.dataTransfer.files)
  }, [images, maxImages])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      openCropModal(e.target.files)
    }
    // Reset input
    e.target.value = ''
  }

  const removeImage = async (index: number) => {
    const imageUrl = images[index]
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)

    // Delete from R2 if it's our uploaded image
    if (imageUrl && imageUrl.includes('r2.dev')) {
      try {
        await fetch(`${API_URL}/api/admin/images?url=${encodeURIComponent(imageUrl)}`, {
          method: 'DELETE',
        })
        console.log('Deleted from R2:', imageUrl)
      } catch (err) {
        console.error('Failed to delete from R2:', err)
        // Don't show error to user - image is already removed from product
      }
    }
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={url} className="relative group aspect-square">
              <img
                src={url}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'up')}
                    className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Move left"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'down')}
                    className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Move right"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {index === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary-500 text-white text-xs rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <svg
            className="w-10 h-10 text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-600 mb-1">
            <span className="text-primary-600 font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, WebP up to 10MB ({images.length}/{maxImages})
          </p>
        </label>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Crop Modal */}
      {cropModalOpen && imageToCrop && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Crop Image {pendingFiles.length > 1 ? `(${currentFileIndex + 1}/${pendingFiles.length})` : ''}
              </h3>
              <button
                onClick={() => {
                  setCropModalOpen(false)
                  setImageToCrop(null)
                  setPendingFiles([])
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Drag the crop area to select the square portion you want. Images will be resized to 1200x1200px.
            </p>

            <div className="flex justify-center mb-4 bg-gray-100 rounded-lg p-2">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                aspect={1}
                circularCrop={false}
                className="max-h-[50vh]"
              >
                <img
                  ref={imgRef}
                  src={imageToCrop}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  className="max-h-[50vh] max-w-full"
                />
              </ReactCrop>
            </div>

            <div className="flex justify-end gap-3">
              {pendingFiles.length > 1 && (
                <button
                  type="button"
                  onClick={skipCurrentImage}
                  disabled={uploading}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  Skip
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setCropModalOpen(false)
                  setImageToCrop(null)
                  setPendingFiles([])
                }}
                disabled={uploading}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={uploadCroppedImage}
                disabled={uploading || !crop}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>Upload Cropped Image</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
