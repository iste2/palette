'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadCloud, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadError {
  message: string;
  code: 'invalid-type' | 'size-too-large' | 'upload-failed';
}

type ValidImageType = 'image/jpeg' | 'image/png' | 'image/webp'

export default function Home() {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<UploadError | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const VALID_IMAGE_TYPES: ValidImageType[] = ['image/jpeg', 'image/png', 'image/webp']
  const MAX_SIZE_MB = 5

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  function validateFile(file: File): UploadError | null {
    if (!VALID_IMAGE_TYPES.includes(file.type as ValidImageType)) {
      return {
        message: 'Please upload a valid image file (JPG, PNG, or WebP)',
        code: 'invalid-type'
      }
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return {
        message: `File size must be less than ${MAX_SIZE_MB}MB`,
        code: 'size-too-large'
      }
    }

    return null
  }

  async function handleFile(file: File) {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    // Here you would typically handle the file upload to your backend
    // For now, we'll just log it
    console.log('File ready for processing:', file)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  function handleRemoveImage() {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <main className="container max-w-5xl mx-auto px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">
            Image Color Extractor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-lg",
              "transition-all duration-200 ease-in-out",
              "flex flex-col items-center justify-center gap-4",
              isDragging ? 
                "border-primary bg-primary/5" : 
                "border-muted-foreground/25 hover:border-primary hover:bg-primary/5",
              preview ? "p-4" : "p-12",
              "cursor-pointer"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileInput}
            />
            
            {preview ? (
              <>
                <div className="relative w-full aspect-[3/2]">
                  <img
                    src={preview}
                    alt="Upload preview"
                    className="rounded-md object-contain w-full h-full"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveImage()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="rounded-full bg-primary/10 p-4">
                  <UploadCloud className="h-10 w-10 text-primary" />
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="text-lg font-semibold">
                    Drop your image here, or click to browse
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Supports JPG, PNG, and WebP (up to {MAX_SIZE_MB}MB)
                  </div>
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 text-sm text-destructive bg-destructive/10 rounded-md">
              {error.message}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
} 