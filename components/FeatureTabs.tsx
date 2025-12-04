
import React from 'react';
import { Feature } from '../types';

interface FeatureTabsProps {
  activeFeature: Feature;
  setActiveFeature: (feature: Feature) => void;
}

const features = [
  { id: Feature.StyleMe, name: 'Style Me' },
  { id: Feature.VirtualTryOn, name: 'Virtual Try-On' },
  { id: Feature.StylistChat, name: 'Stylist Chat' },
];

const FeatureTabs: React.FC<FeatureTabsProps> = ({ activeFeature, setActiveFeature }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-center border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`${
                activeFeature === feature.id
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none`}
            >
              {feature.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default FeatureTabs;
