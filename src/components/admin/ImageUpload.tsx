"use client";

import React, { useState, useRef } from "react";
import { ImageIcon, Loader2, Upload } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string;
  onUploadComplete: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ currentImage, onUploadComplete, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onUploadComplete(data.url);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
      {label && <label className="text-[10px] font-bold uppercase tracking-widest text-foreground sm:w-32 shrink-0">{label}</label>}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-20 h-24 bg-foreground/5 border border-foreground/10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
          {currentImage ? (
            <img src={currentImage} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <ImageIcon className="text-foreground/20" size={24} />
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={20} />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 bg-foreground/5 border border-foreground/10 hover:border-foreground/30 text-foreground py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <Upload size={14} /> {isUploading ? "Uploading..." : "Upload from device"}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
