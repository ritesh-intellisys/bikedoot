import React, { useState } from 'react';
import WashingBrandSelectionPopup from './WashingBrandSelectionPopup';
import WashingModelSelectionPopup from './WashingModelSelectionPopup';

const WashingAddBikeModal = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState('brand'); // 'brand', 'model'
  const [selectedBrand, setSelectedBrand] = useState(null);

  const handleBrandSelect = (brand) => {
    console.log('🔍 Brand selected in WashingAddBikeModal:', brand);
    setSelectedBrand(brand);
    setCurrentStep('model');
  };

  const handleModelSelect = (bikeData) => {
    console.log('🔍 Bike created in WashingAddBikeModal:', bikeData);
    onSuccess(bikeData);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep('brand');
    setSelectedBrand(null);
    onClose();
  };

  const handleBackToBrands = () => {
    setCurrentStep('brand');
    setSelectedBrand(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Brand Selection Popup */}
      <WashingBrandSelectionPopup
        isOpen={currentStep === 'brand'}
        onClose={handleClose}
        onBrandSelect={handleBrandSelect}
      />

      {/* Model Selection Popup */}
      <WashingModelSelectionPopup
        isOpen={currentStep === 'model'}
        onClose={handleBackToBrands}
        onModelSelect={handleModelSelect}
        selectedBrand={selectedBrand}
      />
    </>
  );
};

export default WashingAddBikeModal;
