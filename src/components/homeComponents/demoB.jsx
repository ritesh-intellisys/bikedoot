import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Demo data - copied from API structure
const DEMO_BIKE_BRANDS = [
  { id: 1, name: 'Honda', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  { id: 2, name: 'Bajaj', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  { id: 3, name: 'TVS', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  { id: 4, name: 'Hero', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  { id: 5, name: 'Yamaha', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  { id: 6, name: 'Royal Enfield', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  { id: 7, name: 'KTM', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  { id: 8, name: 'Suzuki', image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
];

const DEMO_BIKE_MODELS = {
  1: [ // Honda
    { id: 1, name: 'Activa 6G', cc: '110cc', cc_id: 1, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 2, name: 'Shine', cc: '125cc', cc_id: 2, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 3, name: 'Unicorn', cc: '160cc', cc_id: 3, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 4, name: 'CBR 150R', cc: '150cc', cc_id: 4, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  ],
  2: [ // Bajaj
    { id: 5, name: 'Pulsar 150', cc: '150cc', cc_id: 4, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 6, name: 'Pulsar 200', cc: '200cc', cc_id: 5, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 7, name: 'Dominar 400', cc: '400cc', cc_id: 6, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 8, name: 'CT 100', cc: '100cc', cc_id: 7, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  ],
  3: [ // TVS
    { id: 9, name: 'Apache RTR 160', cc: '160cc', cc_id: 3, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 10, name: 'Jupiter', cc: '110cc', cc_id: 1, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 11, name: 'Apache RTR 200', cc: '200cc', cc_id: 5, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  ],
  4: [ // Hero
    { id: 12, name: 'Splendor Plus', cc: '100cc', cc_id: 7, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 13, name: 'Passion Pro', cc: '110cc', cc_id: 1, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 14, name: 'Xpulse 200', cc: '200cc', cc_id: 5, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  ],
  5: [ // Yamaha
    { id: 15, name: 'FZ-S', cc: '150cc', cc_id: 4, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 16, name: 'R15 V4', cc: '155cc', cc_id: 8, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 17, name: 'MT-15', cc: '155cc', cc_id: 8, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  ],
  6: [ // Royal Enfield
    { id: 18, name: 'Classic 350', cc: '350cc', cc_id: 9, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 19, name: 'Bullet 350', cc: '350cc', cc_id: 9, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 20, name: 'Himalayan', cc: '411cc', cc_id: 10, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  ],
  7: [ // KTM
    { id: 21, name: 'Duke 200', cc: '200cc', cc_id: 5, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 22, name: 'Duke 390', cc: '390cc', cc_id: 11, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 23, name: 'RC 200', cc: '200cc', cc_id: 5, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  ],
  8: [ // Suzuki
    { id: 24, name: 'Gixxer SF', cc: '155cc', cc_id: 8, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 25, name: 'Access 125', cc: '125cc', cc_id: 2, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
    { id: 26, name: 'Burgman Street', cc: '125cc', cc_id: 2, image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg' },
  ],
};

const DEMO_SERVICES = [
  { id: 1, name: 'Basic Wash', price: 150, service_type: 'Service' },
  { id: 2, name: 'Premium Wash', price: 300, service_type: 'Service' },
  { id: 3, name: 'Wax Polish', price: 200, service_type: 'Add-On' },
  { id: 4, name: 'Engine Cleaning', price: 250, service_type: 'Add-On' },
  { id: 5, name: 'Chain Lubrication', price: 100, service_type: 'Add-On' },
];

const DemoBookingFlow = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedBike, setSelectedBike] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const steps = ['Select Bike', 'Select Services', 'Choose Date & Time', 'Summary'];

  // Demo user vehicles
  const [userVehicles, setUserVehicles] = useState([
    {
      id: 1,
      name: 'Honda Activa 6G',
      brand: 'Honda',
      model: 'Activa 6G',
      cc: '110cc',
      image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg',
      year: 2023,
      registration_number: 'MH12AB1234'
    },
    {
      id: 2,
      name: 'Bajaj Pulsar 150',
      brand: 'Bajaj',
      model: 'Pulsar 150',
      cc: '150cc',
      image: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg',
      year: 2022,
      registration_number: 'MH12CD5678'
    }
  ]);

  const handleNext = () => {
    if (activeStep === 0 && !selectedBike) {
      alert('Please choose your vehicle to continue with the booking');
      return;
    }
    if (activeStep === 1 && selectedServices.length === 0) {
      alert('Please select at least one service for your vehicle');
      return;
    }
    if (activeStep === 2 && (!selectedDate || !selectedTime || !selectedAddress)) {
      alert('Please complete all booking details to proceed');
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleBikeSelect = (bike) => {
    setSelectedBike(bike);
  };

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => 
      prev.find(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
    );
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setShowBrandModal(false);
    setShowModelModal(true);
  };

  const handleModelSelect = (model) => {
    const newBike = {
      id: Date.now(),
      name: `${selectedBrand.name} ${model.name}`,
      brand: selectedBrand.name,
      model: model.name,
      cc: model.cc,
      image: model.image,
      year: new Date().getFullYear(),
      registration_number: `TEMP-${Date.now()}`
    };
    setUserVehicles(prev => [...prev, newBike]);
    setSelectedBike(newBike);
    setShowModelModal(false);
    setSelectedBrand(null);
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const renderStep = () => {
    switch(activeStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Select Your Bike</h2>
              <p className="text-gray-400">Choose the bike you want to service</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {userVehicles.map((bike) => (
                <div
                  key={bike.id}
                  onClick={() => handleBikeSelect(bike)}
                  className={`bg-gray-800 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-700 ${
                    selectedBike?.id === bike.id
                      ? 'ring-2 ring-red-500 bg-gray-700 scale-105'
                      : 'hover:scale-102'
                  }`}
                >
                  <div className="text-center">
                    <img
                      src={bike.image}
                      alt={bike.name}
                      className="w-16 h-16 mx-auto mb-3 object-cover rounded-lg"
                    />
                    <h3 className="text-sm font-semibold text-white mb-1">{bike.name}</h3>
                    <p className="text-xs text-gray-400">{bike.registration_number}</p>
                    {selectedBike?.id === bike.id && (
                      <div className="mt-2">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                          Selected
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div
                onClick={() => setShowBrandModal(true)}
                className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-red-500 hover:bg-gray-700 flex flex-col items-center justify-center min-h-[140px]"
              >
                <PlusIcon className="w-6 h-6 text-gray-400 mb-2" />
                <h3 className="text-sm font-semibold text-white mb-1">Add New Bike</h3>
                <p className="text-gray-400 text-xs text-center">
                  Don't see your bike? Add it to your profile
                </p>
              </div>
            </div>

            {selectedBike && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Selected Bike</h3>
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedBike.image}
                    alt={selectedBike.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="text-white font-medium">{selectedBike.name}</h4>
                    <p className="text-gray-400 text-sm">{selectedBike.registration_number}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Select Services</h2>
              <p className="text-gray-400">Choose the services you need</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEMO_SERVICES.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceToggle(service)}
                  className={`bg-gray-800 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-700 ${
                    selectedServices.find(s => s.id === service.id)
                      ? 'ring-2 ring-red-500 bg-gray-700'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">{service.name}</h3>
                      <p className="text-gray-400 text-sm">{service.service_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">₹{service.price}</p>
                      {selectedServices.find(s => s.id === service.id) && (
                        <div className="mt-1">
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                            Selected
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedServices.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Selected Services</h3>
                <div className="space-y-2">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between items-center">
                      <span className="text-white">{service.name}</span>
                      <span className="text-white font-bold">₹{service.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-700 pt-2 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-white font-bold">₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Date & Time</h2>
              <p className="text-gray-400">Select when you want the service</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Select Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Choose time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Service Address</label>
              <textarea
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                placeholder="Enter your complete address"
                rows={3}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Booking Summary</h2>
              <p className="text-gray-400">Review your booking details</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Bike Details</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={selectedBike.image}
                  alt={selectedBike.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="text-white font-medium">{selectedBike.name}</h4>
                  <p className="text-gray-400 text-sm">{selectedBike.registration_number}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Selected Services</h3>
              <div className="space-y-2">
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex justify-between items-center">
                    <span className="text-white">{service.name}</span>
                    <span className="text-white font-bold">₹{service.price}</span>
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Total</span>
                    <span className="text-white font-bold text-lg">₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Service Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-white">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-white text-right">{selectedAddress}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Demo Booking Flow</h1>
              <p className="text-gray-400 mt-1">Two Wheeler Service Booking</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= activeStep
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <span className={`ml-2 text-sm ${
                index <= activeStep ? 'text-white' : 'text-gray-400'
              }`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  index < activeStep ? 'bg-red-600' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
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
          ) : (
            <button
              onClick={() => {
                alert('Demo booking completed! This is a demo flow.');
                navigate('/');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Complete Booking
            </button>
          )}
        </div>
      </div>

      {/* Brand Selection Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Select Bike Brand</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search brand"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
                  />
                </div>
                <button
                  onClick={() => setShowBrandModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {DEMO_BIKE_BRANDS
                  .filter(brand => 
                    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((brand) => (
                    <div
                      key={brand.id}
                      onClick={() => handleBrandSelect(brand)}
                      className="bg-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-600 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center min-h-[140px]"
                    >
                      <div className="w-16 h-16 mb-3 flex items-center justify-center">
                        <img
                          src={brand.image}
                          alt={brand.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-white text-sm font-medium text-center">
                        {brand.name}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Selection Modal */}
      {showModelModal && selectedBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-white">Select Bike Model</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedBrand.name} Models
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search model"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
                  />
                </div>
                <button
                  onClick={() => {
                    setShowModelModal(false);
                    setSelectedBrand(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {DEMO_BIKE_MODELS[selectedBrand.id]
                  ?.filter(model => 
                    model.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((model) => (
                    <div
                      key={model.id}
                      onClick={() => handleModelSelect(model)}
                      className="bg-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-600 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center min-h-[160px]"
                    >
                      <div className="w-20 h-20 mb-3 flex items-center justify-center">
                        <img
                          src={model.image}
                          alt={model.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-white text-sm font-medium text-center mb-1">
                        {model.name}
                      </p>
                      <p className="text-gray-400 text-xs text-center">
                        {model.cc}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoBookingFlow;
