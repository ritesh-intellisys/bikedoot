import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StepperNavigation from './StepperNavigation';
import SelectBikeStep from './bookingSteps/SelectBikeStep';
import SelectServiceStep from './bookingSteps/SelectServiceStep';
import SlotAndAddressStep from './bookingSteps/SlotAndAddressStep';
import SummaryStep from './bookingSteps/SummaryStep';
import { fetchGarageById } from '../../services/garageDetailService';

const BookingFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get garageId from URL params or navigation state
  const urlParams = new URLSearchParams(location.search);
  const garageId = urlParams.get('garageId') || location.state?.garageId;
  const returnTo = urlParams.get('returnTo') || location.state?.returnTo;
  const vehicleType = urlParams.get('vehicleType') || location.state?.vehicleType;
  
  // Main booking state
  const [activeStep, setActiveStep] = useState(0);
  const [bikeData, setBikeData] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [slotAndAddress, setSlotAndAddress] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [garageInfo, setGarageInfo] = useState(null);
  
  const steps = ["Select Bike", "Service", "Slot & Address", "Summary"];
  
  // Check authentication and fetch garage info
  useEffect(() => {
    try {
      console.log("BookingFlow mounted with garageId:", garageId);
      console.log("Location state:", location.state);
      
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No authentication token, redirecting to login");
        navigate("/login");
        return;
      }
      
      if (!garageId) {
        console.log("No garageId, redirecting to home");
        navigate("/");
        return;
      }
      
      // Fetch garage information
      const fetchGarageInfo = async () => {
        try {
          const garageData = await fetchGarageById(garageId);
          if (garageData) {
            setGarageInfo(garageData);
            console.log("Garage info loaded:", garageData);
          } else {
            console.error("Failed to load garage information");
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching garage info:", error);
          navigate("/");
        }
      };
      
      fetchGarageInfo();
      console.log("BookingFlow ready with garageId:", garageId);
    } catch (error) {
      console.error("Error in BookingFlow useEffect:", error);
      navigate("/");
    }
  }, [garageId, navigate, location.state]);
  
  // Navigation logic with validation
  const handleNext = () => {
    setErrors({});
    
    if (activeStep === 0 && !bikeData) {
      setErrors({ bike: "Please select a bike to continue" });
      return;
    }
    if (activeStep === 1 && !selectedService) {
      setErrors({ service: "Please select at least one service to continue" });
      return;
    }
    if (activeStep === 2 && !slotAndAddress) {
      setErrors({ slot: "Please select date, time, and address to continue" });
      return;
    }
    
    setActiveStep(prev => prev + 1);
  };
  
  const handlePrevious = () => {
    setActiveStep(prev => prev - 1);
    setErrors({});
  };
  
  const handleStepClick = (stepIndex) => {
    // Allow navigation to previous steps only
    if (stepIndex < activeStep) {
      setActiveStep(stepIndex);
      setErrors({});
    }
  };
  
  // Render current step component
  const renderStep = () => {
    const commonProps = {
      garageId,
      garageInfo,
      bikeData,
      selectedService,
      slotAndAddress,
      suggestion,
      setBikeData,
      setSelectedService,
      setSlotAndAddress,
      setSuggestion,
      loading,
      setLoading,
      errors,
      setErrors
    };
    
    switch(activeStep) {
      case 0:
        return <SelectBikeStep {...commonProps} />;
      case 1:
        return <SelectServiceStep {...commonProps} />;
      case 2:
        return <SlotAndAddressStep {...commonProps} />;
      case 3:
        return <SummaryStep {...commonProps} />;
      default:
        return <SelectBikeStep {...commonProps} />;
    }
  };
  
  if (!garageId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid Booking Request</h2>
          <p className="text-gray-400 mb-6">Please select a garage first to start booking.</p>
          <button
            onClick={() => {
              if (returnTo === 'garage-list' && vehicleType) {
                navigate(`/?vehicleType=${vehicleType}`);
              } else {
                navigate("/");
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            ←
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while garage info is being fetched
  if (!garageInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading garage information...</p>
        </div>
      </div>
    );
  }
  
  try {
    return (
      <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Book Service</h1>
              <p className="text-gray-400 mt-1">Complete your booking in 4 simple steps</p>
            </div>
            <button
              onClick={() => {
                // Return to garage list if that's where we came from, otherwise go to home
                if (returnTo === 'garage-list' && vehicleType) {
                  // Navigate back to garage list with vehicle type
                  navigate(`/?vehicleType=${vehicleType}`);
                } else {
                  navigate("/");
                }
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Stepper Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <StepperNavigation
          steps={steps}
          activeStep={activeStep}
          onStepClick={handleStepClick}
        />
      </div>
      
      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {renderStep()}
      </div>
      
      {/* Navigation Buttons */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={activeStep === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeStep === 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            Previous
          </button>
          
          {activeStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Next
            </button>
          ) : null}
        </div>
      </div>
      
      {/* Error Display */}
      {Object.keys(errors).length > 0 && Object.values(errors).some(error => error && error.trim()) && (
        <div className="fixed bottom-4 right-4 max-w-sm">
          <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Please complete the following:</span>
            </div>
            <ul className="mt-2 text-sm">
              {Object.values(errors)
                .filter(error => error && error.trim())
                .map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
  } catch (error) {
    console.error("Error rendering BookingFlow:", error);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Booking</h1>
          <p className="text-gray-400 mb-4">Something went wrong. Please try again.</p>
          <button 
            onClick={() => {
              if (returnTo === 'garage-list' && vehicleType) {
                navigate(`/?vehicleType=${vehicleType}`);
              } else {
                navigate("/");
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            ←
          </button>
        </div>
      </div>
    );
  }
};

export default BookingFlow;