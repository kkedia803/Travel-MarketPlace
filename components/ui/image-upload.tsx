"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  currentImages: string[];
  className?: string;
  maxImages?: number;
}

export function ImageUpload({ 
  onUploadComplete, 
  currentImages, 
  className, 
  maxImages = 3 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validImages, setValidImages] = useState<string[]>([]);
  
  useEffect(() => {
    const filtered = currentImages.filter(url => 
      url && 
      url.trim() !== "" && 
      !url.includes("placeholder.svg")
    );
    setValidImages(filtered);
  }, [currentImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (validImages.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.details || 'Failed to upload image');
        }

        uploadedUrls.push(data.url);
      }

      const newImages = [...validImages, ...uploadedUrls].slice(0, maxImages);
      onUploadComplete(newImages);
    } catch (err) {
      const errorMessage = (err as Error).message || 'Unknown error occurred';
      console.error('Upload error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = validImages.filter((_, index) => index !== indexToRemove);
    onUploadComplete(newImages);
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-4 mb-4">
        {validImages.map((url, index) => (
          <div key={`${url}-${index}`} className="relative">
            <img
              src={url}
              alt={`Upload ${index + 1}`}
              className="w-24 h-24 object-cover rounded-md"
              onError={(e) => {
                console.error(`Failed to load image: ${url}`);
                e.currentTarget.src = "/placeholder.svg?height=96&width=96";
              }}
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {validImages.length < maxImages && (
        <>
          <input
            type="file"
            id="image-upload"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
            multiple
          />
          <label htmlFor="image-upload">
            <Button
              variant="outline"
              type="button"
              className="h-10 cursor-pointer"
              disabled={isUploading}
              asChild
            >
              <span>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images ({validImages.length}/{maxImages})
                  </>
                )}
              </span>
            </Button>
          </label>
        </>
      )}
      
      {error && (
        <p className="text-xs text-destructive mt-1">
          Error: {error}
        </p>
      )}
    </div>
  );
}
