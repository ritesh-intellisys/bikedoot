import React, { useState } from 'react';
import BrandSelectionPopup from './BrandSelectionPopup';
import ModelSelectionPopup from './ModelSelectionPopup';

const AddBikeModal = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState('brand'); // 'brand', 'model'
  const [selectedBrand, setSelectedBrand] = useState(null);

  const handleBrandSelect = (brand) => {
    console.log('🔍 Brand selected in AddBikeModal:', brand);
    setSelectedBrand(brand);
    setCurrentStep('model');
  };

  const handleModelSelect = (bikeData) => {
    console.log('🔍 Bike created in AddBikeModal:', bikeData);
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
      <BrandSelectionPopup
        isOpen={currentStep === 'brand'}
        onClose={handleClose}
        onBrandSelect={handleBrandSelect}
      />

      {/* Model Selection Popup */}
      <ModelSelectionPopup
        isOpen={currentStep === 'model'}
        onClose={handleBackToBrands}
        onModelSelect={handleModelSelect}
        selectedBrand={selectedBrand}
      />
    </>
  );
};

export default AddBikeModal;

