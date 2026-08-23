"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useToast } from "./toast";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  folder?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
  folder = "products",
  disabled = false,
}: ImageUploadProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error("Upload error:", error);
      toast(
        error instanceof Error ? error.message : "Failed to upload image",
        "error"
      );
      return null;
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = maxFiles - value.length;

    if (fileArray.length > remainingSlots) {
      toast(`You can only upload ${remainingSlots} more image(s)`, "error");
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of fileArray) {
      const url = await uploadFile(file);
      if (url) {
        newUrls.push(url);
      }
    }

    if (newUrls.length > 0) {
      onChange([...value, ...newUrls]);
      toast(
        `${newUrls.length} image(s) uploaded successfully`,
        "success"
      );
    }

    setUploading(false);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [disabled, value.length, maxFiles]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newUrls = [...value];
    const [removed] = newUrls.splice(fromIndex, 1);
    newUrls.splice(toIndex, 0, removed);
    onChange(newUrls);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex h-48 items-center justify-center rounded-lg border-2 border-dashed
          transition-colors duration-200
          ${isDragging 
            ? "border-gold bg-gold/10" 
            : "border-dark-border bg-dark-surface/50 hover:border-warm-gray/40"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleInputChange}
          disabled={disabled || uploading || value.length >= maxFiles}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        
        <div className="text-center">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              <p className="text-sm text-warm-gray">Uploading...</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-warm-gray">
                {isDragging ? "Drop images here" : "Drag and drop images here"}
              </p>
              <p className="mt-1 text-xs text-warm-gray/60">
                or click to browse. Max {maxFiles} images, 5MB each.
              </p>
              <p className="mt-1 text-xs text-warm-gray/40">
                {value.length}/{maxFiles} images uploaded
              </p>
            </>
          )}
        </div>
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((url, index) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-dark-border"
            >
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              
              {/* Overlay Controls */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index - 1)}
                    className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                    title="Move left"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="rounded-full bg-red-500/80 p-2 text-white hover:bg-red-500"
                  title="Remove image"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {index < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index + 1)}
                    className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                    title="Move right"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute left-2 top-2 rounded bg-gold px-2 py-0.5 text-xs font-medium text-black">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
