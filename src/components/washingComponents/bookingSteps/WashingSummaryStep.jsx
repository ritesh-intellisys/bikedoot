import React, { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSprayCan, faCar, faMotorcycle, faTruck } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';

const WashingSummaryStep = ({ 
  bikeData, 
  selectedService, 
  slotAndAddress, 
  suggestion, 
  setSuggestion,
  washingCenterInfo,
  loading, 
  setLoading, 
  errors, 
  setErrors 
}) => {
  const { theme } = useTheme();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [serviceType, setServiceType] = useState('');
  
  const calculateTotal = () => {
    if (!selectedService) return 0;
    return selectedService.reduce((sum, service) => sum + parseFloat(service.price || 0), 0);
  };
  
  const applyPromoCode = () => {
    const total = calculateTotal();
    const discount = total * 0.1; // 10% discount for WASH10
    return {
      originalTotal: total,
      discount: discount,
      finalTotal: total - discount
    };
  };
  
  const handleBooking = async () => {
    setLoading(true);
    setErrors({});
    
    try {
      const total = calculateTotal();
      const promoData = applyPromoCode();
      
      // Format date like old website (extract date from date string)
      const formattedDate = slotAndAddress.date.split(' ')[0];
      
      // Mock booking payload for washing service
      const payload = {
        businessid: parseInt(localStorage.getItem("businessId") || "1"),
        subscriberid: parseInt(localStorage.getItem("subscriberId") || "1"),
        subscribervehicleid: bikeData.vehicle_id || bikeData.id,
        subscriberaddressid: slotAndAddress.address?.id,
        washingcenterid: washingCenterInfo?.id,
        bookingdate: formattedDate,
        bookingslot: slotAndAddress.slot,
        suggestion: suggestion.trim(),
        bookingamount: calculateTotal().toFixed(2),
        promocode: "WASH10",
        requiredestimate: slotAndAddress.estimate === "yes",
        servicetype: serviceType || undefined,
        servicecategory: "washing-detailing"
      };
      
      console.log("🔍 Creating washing booking with payload:", payload);
      
      // Mock API call - replace with real API later
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful response
      const mockResponse = {
        success: true,
        data: {
          booking_id: `WASH${Date.now()}`,
          booking_date: slotAndAddress.date,
          booking_slot: slotAndAddress.slot,
          total_amount: calculateTotal().toFixed(2),
          washing_center: washingCenterInfo?.name,
          services: selectedService?.map(s => s.name).join(', ')
        }
      };
      
      if (mockResponse.success) {
        setBookingData(mockResponse.data);
        setBookingSuccess(true);
      } else {
        setErrors({ booking: 'Failed to create booking. Please try again.' });
      }
    } catch (error) {
      console.error('Error creating washing booking:', error);
      setErrors({ booking: 'Failed to create booking. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const formatTime = (timeString) => {
    const [hour] = timeString.split(':');
    const hourNum = parseInt(hour);
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum;
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    return `${displayHour}:00 ${ampm}`;
  };

  const getVehicleTypeIcon = (vehicleType) => {
    switch(vehicleType) {
      case 'car': return faCar;
      case 'bike': return faMotorcycle;
      case 'truck': return faTruck;
      default: return faCar;
    }
  };
  
  if (bookingSuccess && bookingData) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className={`text-3xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Washing Booking Confirmed!</h2>
          <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Your washing service has been successfully booked. You will receive a confirmation SMS shortly.
          </p>
          
          <div className={`rounded-xl p-6 border mb-6 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Booking Details</h3>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Booking ID:</span>
                <span className={`font-mono ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{bookingData.booking_id}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Date:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{formatDate(bookingData.booking_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Time:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{formatTime(bookingData.booking_slot)}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Washing Center:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{bookingData.washing_center}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Services:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{bookingData.services}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Total Amount:</span>
                <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>₹{bookingData.total_amount}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ←
          </button>
        </div>
      </div>
    );
  }
  
  const promoData = applyPromoCode();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Review Your Washing Booking</h2>
        <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Please review all details before confirming</p>
      </div>
      
      {/* Error Display */}
      {errors.booking && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <p>{errors.booking}</p>
        </div>
      )}
      
      {/* Bike Details - Card Format */}
      <div className="flex justify-center">
        <div className={`rounded-xl p-6 border max-w-xs w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 text-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Selected Vehicle</h3>
          <div className="flex flex-col items-center space-y-3">
            <div className={`w-32 h-20 rounded-lg overflow-hidden flex items-center justify-center ${
              theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
            }`}>
              <img
                src={bikeData?.image || bikeData?.model?.image || 'https://via.placeholder.com/96'}
                alt={bikeData?.brand || bikeData?.model?.name || 'Vehicle'}
                className="w-full h-full object-contain"
              />
            </div>
            <h4 className={`font-medium text-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {bikeData?.brand || bikeData?.model?.name || 'Unknown Vehicle'}
            </h4>
          </div>
        </div>
      </div>
      
      {/* Washing Center Details */}
      {washingCenterInfo && (
        <div className="flex justify-center">
          <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Washing Center</h3>
            <div className="flex items-center space-x-4">
              <img
                src={washingCenterInfo.image}
                alt={washingCenterInfo.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className={theme === 'light' ? 'text-gray-900' : 'text-white font-medium'}>{washingCenterInfo.name}</h4>
                <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>{washingCenterInfo.location}</p>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{washingCenterInfo.distance}km away</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Services - Card Format */}
      <div className="flex justify-center">
        <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Selected Washing Services</h3>
          {selectedService && selectedService.length > 0 ? (
            <div className="space-y-3">
              {selectedService.map((service) => (
                <div key={service.id}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className={`font-medium text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{service.name}</h4>
                    <span className="text-red-600 font-semibold text-lg">₹{parseFloat(service.price || 0).toFixed(0)}</span>
                  </div>
                  {service.description && (
                    <p className={`text-sm whitespace-pre-line ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{service.description}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Duration: {service.duration}</span>
                    <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Category: {service.category}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>No service selected</p>
          )}
        </div>
      </div>
      
      {/* Schedule - Card Format */}
      {slotAndAddress?.date && slotAndAddress?.slot && (
        <div className="flex justify-center">
          <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Selected Schedule</h3>
            <p className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
              {formatDate(slotAndAddress.date)} at {formatTime(slotAndAddress.slot)}
            </p>
          </div>
        </div>
      )}

      {/* Address - Card Format */}
      {slotAndAddress?.address && (
        <div className="flex justify-center">
          <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Selected Address</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>City:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{slotAndAddress.address.city}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Address:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{slotAndAddress.address.address}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Pincode:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{slotAndAddress.address.pincode}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Additional Details - Card Format */}
      <div className="flex justify-center">
        <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Additional Details</h3>
          <div className="space-y-3">
             {slotAndAddress?.estimate && (
               <p className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                 <strong>Estimate Required:</strong> {slotAndAddress.estimate === "yes" ? 'Yes' : 'No'}
               </p>
             )}
            {suggestion && suggestion.trim() !== "" && (
              <p className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                <strong>Special Instructions:</strong> {suggestion}
              </p>
            )}
            {(!slotAndAddress?.estimate && (!suggestion || suggestion.trim() === "")) && (
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>No additional details</p>
            )}
          </div>
        </div>
      </div>

      {/* Suggestion Input */}
      <div className="flex justify-center">
        <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Special Instructions (Optional)</h3>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Any special instructions or requests for the washing service..."
            rows={3}
            className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 resize-none ${
              theme === 'light'
                ? 'bg-white text-gray-900 border-gray-300'
                : 'bg-gray-700 text-white border-gray-600'
            }`}
          />
        </div>
      </div>
      
      {/* Final Price - Simple format */}
      {selectedService && selectedService.length > 0 && (
        <div className="flex justify-center">
          <div className={`rounded-xl p-6 border max-w-lg w-full text-center ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Final Price</h3>
            <p className="text-2xl font-bold text-red-600">₹{calculateTotal().toFixed(0)}</p>
          </div>
        </div>
      )}

      {/* Service Type Selection (UI only, no API) */}
      <div className="flex justify-center">
        <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Select Service Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 'pickup_drop', label: 'Pickup & Drop' },
              { id: 'garage_servicing', label: 'Garage Servicing' },
              { id: 'doorstep_servicing', label: 'Doorstep Servicing' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setServiceType(opt.id)}
                className={`px-3 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  serviceType === opt.id
                    ? 'bg-red-600 border-red-600 text-white'
                    : theme === 'light'
                    ? 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {!serviceType && (
            <p className={`text-sm mt-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Please choose a service type. You can change this later.</p>
          )}
        </div>
      </div>
      
      {/* Confirm Booking Button */}
      <div className="text-center">
        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? 'Confirming Washing Booking...' : 'Confirm Washing Booking'}
        </button>
        <p className={`text-sm mt-3 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
          By confirming, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
};

export default WashingSummaryStep;
