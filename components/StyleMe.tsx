
import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import LoadingSpinner from './LoadingSpinner';
import { getAccessoryRecommendations } from '../services/geminiService';

interface StyleMeProps {
  dressImage: string | null;
  setDressImage: (image: string | null) => void;
}

const StyleMe: React.FC<StyleMeProps> = ({ dressImage, setDressImage }) => {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<string>('');

  const handleGetRecommendations = async () => {
    if (!dressImage) return;
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const result = await getAccessoryRecommendations(dressImage, preferences);
      setRecommendations(result);
    } catch (e) {
      console.error(e);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setDressImage(null);
    setRecommendations(null);
    setError(null);
    setPreferences('');
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Style Me</h2>
      <p className="text-center text-gray-600">Upload a photo of a dress to get styling advice and accessory recommendations from our AI stylist.</p>
      
      {!dressImage && <ImageUpload onImageUpload={(img) => setDressImage(img)} imagePreview={null} clearImage={clearAll} title="Upload a Photo of Your Dress" />}

      {dressImage && (
        <div className="flex flex-col items-center space-y-4">
            <div className="w-full max-w-sm">
                <img src={dressImage} alt="Uploaded dress" className="rounded-lg shadow-md w-full" />
            </div>
             <div className="w-full max-w-sm">
                <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-1">
                    Any preferences? (optional)
                </label>
                <input
                    type="text"
                    id="preferences"
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    placeholder="e.g., 'gold jewelry', 'casual style'"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                    disabled={isLoading}
                />
            </div>
            <div className="flex space-x-4">
                <button
                    onClick={handleGetRecommendations}
                    disabled={isLoading}
                    className="px-6 py-2 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 disabled:bg-pink-300 transition-colors duration-200"
                >
                    {isLoading ? 'Styling...' : 'Get Recommendations'}
                </button>
                 <button
                    onClick={clearAll}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200"
                >
                    Clear
                </button>
            </div>
        </div>
      )}

      {isLoading && <LoadingSpinner message="Our AI is styling your look..." />}
      
      {error && <div className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</div>}

      {recommendations && (
        <div className="prose prose-pink max-w-none bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div dangerouslySetInnerHTML={{ __html: recommendations.replace(/\n/g, '<br />') }} />
        </div>
      )}
    </div>
  );
};

export default StyleMe;
