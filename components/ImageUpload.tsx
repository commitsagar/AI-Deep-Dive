
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, XCircleIcon } from './icons';

interface ImageUploadProps {
  onImageUpload: (base64: string) => void;
  imagePreview: string | null;
  clearImage: () => void;
  title: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, imagePreview, clearImage, title }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (imagePreview) {
    return (
      <div className="relative group">
        <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg object-contain max-h-96" />
        <button
          onClick={clearImage}
          className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-75"
          aria-label="Clear image"
        >
          <XCircleIcon className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onButtonClick}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
        isDragging ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center text-gray-500">
        <UploadIcon className="w-12 h-12 mb-4" />
        <p className="font-semibold">{title}</p>
        <p className="text-sm">Drag & drop or click to upload</p>
      </div>
    </div>
  );
};

export default ImageUpload;
