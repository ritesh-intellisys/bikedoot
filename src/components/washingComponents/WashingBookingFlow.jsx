import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StepperNavigation from '../homeComponents/StepperNavigation';
import DemoBookingFlow from '../homeComponents/demoB';
import WashingSelectBikeStep from './bookingSteps/WashingSelectBikeStep';
import WashingSelectServiceStep from './bookingSteps/WashingSelectServiceStep';
import WashingSlotAndAddressStep from './bookingSteps/WashingSlotAndAddressStep';
import WashingSummaryStep from './bookingSteps/WashingSummaryStep';

const WashingBookingFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get washingCenterId from URL params or navigation state
  const urlParams = new URLSearchParams(location.search);
  const washingCenterId = urlParams.get('washingCenterId') || location.state?.washingCenterId;
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
  const [washingCenterInfo, setWashingCenterInfo] = useState(null);
  
  const steps = ["Select Bike", "Service", "Slot & Address", "Summary"];
  
  // Mock washing center data (replace with API call later)
  const mockWashingCenters = {
    1: {
      id: 1,
      name: "AutoSpa Premium Detailing",
      location: "Koregaon Park",
      address: "123, ABC Complex, Koregaon Park, Pune",
      phone: "+91 98765 43210",
      rating: 4.8,
      distance: 1.2,
      operatingHours: "8:00 AM - 8:00 PM",
      image: "https://plus.unsplash.com/premium_photo-1661443456250-5cd06d09701c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      services: [
        { name: "Basic Car Wash", price: "₹299" },
        { name: "Premium Detailing", price: "₹1,299" },
        { name: "Interior Cleaning", price: "₹599" },
        { name: "Paint Protection", price: "₹2,999" }
      ],
      vehicleTypes: ['car', 'bike'],
      serviceTypes: ['basic-wash', 'premium-detailing', 'interior'],
      priceRange: 'premium',
      description: "Premium car wash and detailing services with eco-friendly products"
    },
    2: {
      id: 2,
      name: "QuickWash Express",
      location: "Hinjewadi",
      address: "456, Tech Park, Hinjewadi, Pune",
      phone: "+91 98765 43211",
      rating: 4.5,
      distance: 2.1,
      operatingHours: "7:00 AM - 9:00 PM",
      image: "https://plus.unsplash.com/premium_photo-1661443444726-38e00b169bb2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      services: [
        { name: "Express Wash", price: "₹199" },
        { name: "Vacuum Cleaning", price: "₹99" },
        { name: "Tire Shine", price: "₹149" }
      ],
      vehicleTypes: ['car', 'bike'],
      serviceTypes: ['basic-wash', 'express'],
      priceRange: 'budget',
      description: "Quick and efficient car wash services for busy professionals"
    },
    3: {
      id: 3,
      name: "Elite Detailing Studio",
      location: "Baner",
      address: "789, Business Hub, Baner, Pune",
      phone: "+91 98765 43212",
      rating: 4.9,
      distance: 3.5,
      operatingHours: "9:00 AM - 7:00 PM",
      image: "https://images.unsplash.com/photo-1652454449601-e83b62eabe94?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      services: [
        { name: "Ceramic Coating", price: "₹4,999" },
        { name: "Paint Correction", price: "₹3,999" },
        { name: "Leather Treatment", price: "₹1,999" },
        { name: "Engine Bay Cleaning", price: "₹799" }
      ],
      vehicleTypes: ['car'],
      serviceTypes: ['premium-detailing', 'ceramic-coating'],
      priceRange: 'premium',
      description: "Luxury car detailing with professional-grade equipment"
    },
    4: {
      id: 4,
      name: "BikeWash Pro",
      location: "Wakad",
      address: "321, Service Center, Wakad, Pune",
      phone: "+91 98765 43213",
      rating: 4.6,
      distance: 1.8,
      operatingHours: "8:00 AM - 8:00 PM",
      image: "https://images.unsplash.com/photo-1632823469901-5d2cfff5ba50?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      services: [
        { name: "Bike Wash", price: "₹149" },
        { name: "Chain Cleaning", price: "₹199" },
        { name: "Polish & Wax", price: "₹299" },
        { name: "Seat Cleaning", price: "₹99" }
      ],
      vehicleTypes: ['bike'],
      serviceTypes: ['bike-specific'],
      priceRange: 'budget',
      description: "Specialized bike cleaning and maintenance services"
    }
  };
  
  // Check authentication and fetch washing center info
  useEffect(() => {
    try {
      console.log("WashingBookingFlow mounted with washingCenterId:", washingCenterId);
      console.log("Location state:", location.state);
      
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No authentication token, redirecting to login");
        navigate("/login");
        return;
      }
      
      if (!washingCenterId) {
        console.log("No washingCenterId, redirecting to home");
        navigate("/");
        return;
      }
      
      // Fetch washing center information (mock for now)
      const centerData = mockWashingCenters[washingCenterId];
      if (centerData) {
        setWashingCenterInfo(centerData);
        console.log("Washing center info loaded:", centerData);
      } else {
        console.error("Failed to load washing center information");
        navigate("/");
      }
      
      console.log("WashingBookingFlow ready with washingCenterId:", washingCenterId);
    } catch (error) {
      console.error("Error in WashingBookingFlow useEffect:", error);
      navigate("/");
    }
  }, [washingCenterId, navigate, location.state]);
  
  // Navigation logic with validation
  const handleNext = () => {
    setErrors({});
    
    if (activeStep === 0 && !bikeData) {
      setErrors({ bike: "Please select your vehicle to continue with the booking" });
      return;
    }
    if (activeStep === 1 && !selectedService) {
      setErrors({ service: "Please choose at least one service for your vehicle" });
      return;
    }
    if (activeStep === 2 && !slotAndAddress) {
      setErrors({ slot: "Please complete your booking details to proceed" });
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
      washingCenterId,
      washingCenterInfo,
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
        return <WashingSelectBikeStep {...commonProps} />;
      case 1:
        return <WashingSelectServiceStep {...commonProps} />;
      case 2:
        return <WashingSlotAndAddressStep {...commonProps} />;
      case 3:
        return <WashingSummaryStep {...commonProps} />;
      default:
        return <WashingSelectBikeStep {...commonProps} />;
    }
  };
  
  if (!washingCenterId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid Booking Request</h2>
          <p className="text-gray-400 mb-6">Please select a washing center first to start booking.</p>
          <button
            onClick={() => {
              if (returnTo === 'washing-list') {
                navigate(`/?returnTo=washing-list`);
              } else {
                navigate("/");
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {returnTo === 'washing-list' ? 'Go Back to Washing Centers' : 'Go Back to Home'}
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while washing center info is being fetched
  if (!washingCenterInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading washing center information...</p>
        </div>
      </div>
    );
  }
  
  try {
    // Use demo booking flow for two-wheelers
    if (vehicleType === 'bike' || vehicleType === 'two-wheeler') {
      return <DemoBookingFlow />;
    }

    return (
      <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Book Washing Service</h1>
              <p className="text-gray-400 mt-1">Complete your washing booking in 4 simple steps</p>
            </div>
            <button
              onClick={() => {
                // Return to washing list if that's where we came from, otherwise go to home
                if (returnTo === 'washing-list') {
                  // Navigate back to washing list
                  navigate(`/?returnTo=washing-list`);
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
    console.error("Error rendering WashingBookingFlow:", error);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Booking</h1>
          <p className="text-gray-400 mb-4">Something went wrong. Please try again.</p>
          <button 
            onClick={() => {
              if (returnTo === 'washing-list') {
                navigate(`/?returnTo=washing-list`);
              } else {
                navigate("/");
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            {returnTo === 'washing-list' ? 'Go Back to Washing Centers' : 'Go Back Home'}
          </button>
        </div>
      </div>
    );
  }
};

export default WashingBookingFlow;
