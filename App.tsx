
import React, { useState, useCallback } from 'react';
import { Feature } from './types';
import Header from './components/Header';
import FeatureTabs from './components/FeatureTabs';
import StyleMe from './components/StyleMe';
import VirtualTryOn from './components/VirtualTryOn';
import StylistChat from './components/StylistChat';
import { getDressDescription } from './services/geminiService';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.StyleMe);
  const [dressImage, setDressImage] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [dressDescription, setDressDescription] = useState<string | null>(null);
  const [isDescriptionLoading, setIsDescriptionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetDressImage = useCallback(async (image: string | null) => {
    setDressImage(image);
    setDressDescription(null); // Reset description when image changes
    if (image) {
      setIsDescriptionLoading(true);
      setError(null);
      try {
        const description = await getDressDescription(image);
        setDressDescription(description);
      } catch (e) {
        console.error("Failed to get dress description", e);
        setError("Could not analyze the dress. Please try another image.");
      } finally {
        setIsDescriptionLoading(false);
      }
    }
  }, []);

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case Feature.StyleMe:
        return <StyleMe setDressImage={handleSetDressImage} dressImage={dressImage} />;
      case Feature.VirtualTryOn:
        return <VirtualTryOn 
                  dressImage={dressImage} 
                  setDressImage={handleSetDressImage}
                  userImage={userImage}
                  setUserImage={setUserImage}
                />;
      case Feature.StylistChat:
        return <StylistChat 
                  dressImage={dressImage} 
                  setDressImage={handleSetDressImage}
                  dressDescription={dressDescription}
                  isDescriptionLoading={isDescriptionLoading}
                  descriptionError={error}
                />;
      default:
        return <StyleMe setDressImage={handleSetDressImage} dressImage={dressImage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Your Personal AI Fashion Stylist</h1>
          <p className="mt-2 text-lg text-gray-600">Discover your perfect style with the power of AI.</p>
        </div>
        
        <FeatureTabs activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
        
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          {renderActiveFeature()}
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-gray-500 text-sm">
        <p>Powered by Gemini AI. Created for demonstration purposes.</p>
      </footer>
    </div>
  );
};

export default App;
