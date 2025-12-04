
import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import LoadingSpinner from './LoadingSpinner';
import { generateVirtualTryOn } from '../services/geminiService';

interface VirtualTryOnProps {
    dressImage: string | null;
    setDressImage: (image: string | null) => void;
    userImage: string | null;
    setUserImage: (image: string | null) => void;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ dressImage, setDressImage, userImage, setUserImage }) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTryOn = async () => {
    if (!userImage || !dressImage) return;
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const result = await generateVirtualTryOn(userImage, dressImage);
      setGeneratedImage(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate the virtual try-on. Please try again with different images.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setUserImage(null);
    setDressImage(null);
    setGeneratedImage(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Virtual Try-On</h2>
      <p className="text-center text-gray-600">See what you'd look like! Upload a photo of yourself and a photo of a dress.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUpload 
          onImageUpload={(img) => setUserImage(img)} 
          imagePreview={userImage}
          clearImage={() => setUserImage(null)}
          title="Upload Your Photo"
        />
        <ImageUpload 
          onImageUpload={(img) => setDressImage(img)} 
          imagePreview={dressImage}
          clearImage={() => setDressImage(null)}
          title="Upload Dress Photo"
        />
      </div>

      {userImage && dressImage && !isLoading && !generatedImage && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleGenerateTryOn}
            disabled={isLoading}
            className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 disabled:bg-pink-300 transition-colors duration-200"
          >
            Generate My Look
          </button>
        </div>
      )}

      {isLoading && <LoadingSpinner message="Generating your virtual try-on... This may take a moment." />}
      
      {error && <div className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</div>}

      {generatedImage && (
        <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-xl font-bold text-center text-gray-800">Here's Your Look!</h3>
            <img src={generatedImage} alt="Virtual try-on result" className="rounded-lg shadow-lg w-full max-w-lg" />
            <button
                onClick={clearAll}
                className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
                Start Over
            </button>
        </div>
      )}
    </div>
  );
};

export default VirtualTryOn;
