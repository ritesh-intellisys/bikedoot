import React, { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { createBooking } from '../../../services/bookingService';

const SummaryStep = ({ 
  bikeData, 
  selectedService, 
  slotAndAddress, 
  suggestion, 
  setSuggestion,
  garageId,
  loading, 
  setLoading, 
  errors, 
  setErrors 
}) => {
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  
  const calculateTotal = () => {
    if (!selectedService) return 0;
    return selectedService.reduce((sum, service) => sum + service.price, 0);
  };
  
  const applyPromoCode = () => {
    const total = calculateTotal();
    const discount = total * 0.1; // 10% discount for SUMMER10
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
      
      const payload = {
        businessid: parseInt(localStorage.getItem("businessId") || "1"),
        subscriberid: parseInt(localStorage.getItem("subscriberId") || "1"),
        subscribervehicleid: bikeData.vehicle_id || bikeData.id,
        subscriberaddressid: slotAndAddress.address.id,
        garageid: garageId,
        bookingdate: slotAndAddress.date,
        bookingslot: slotAndAddress.slot,
        suggestion: suggestion.trim(),
        bookingamount: promoData.finalTotal.toFixed(2),
        promocode: "SUMMER10",
        requiredestimate: slotAndAddress.estimate === true,
        services: selectedService.map(service => ({
          service_id: service.id,
          service_name: service.name,
          service_price: service.price
        }))
      };
      
      const response = await createBooking(payload);
      
      if (response.success) {
        setBookingData(response.data);
        setBookingSuccess(true);
      } else {
        setErrors({ booking: 'Failed to create booking. Please try again.' });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
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
  
  if (bookingSuccess && bookingData) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h2>
          <p className="text-gray-400 mb-6">
            Your service has been successfully booked. You will receive a confirmation SMS shortly.
          </p>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Booking Details</h3>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Booking ID:</span>
                <span className="text-white font-mono">{bookingData.booking_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span className="text-white">{formatDate(bookingData.booking_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time:</span>
                <span className="text-white">{formatTime(bookingData.booking_slot)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Amount:</span>
                <span className="text-white font-semibold">₹{bookingData.total_amount}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Home
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
        <h2 className="text-2xl font-bold text-white mb-2">Review Your Booking</h2>
        <p className="text-gray-400">Please review all details before confirming</p>
      </div>
      
      {/* Error Display */}
      {errors.booking && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <p>{errors.booking}</p>
        </div>
      )}
      
      {/* Bike Details */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Selected Bike</h3>
        <div className="flex items-center space-x-4">
          <img
            src={bikeData?.image}
            alt={`${bikeData?.brand} ${bikeData?.model}`}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <h4 className="text-white font-medium">
              {bikeData?.brand} {bikeData?.model}
            </h4>
            <p className="text-gray-400 text-sm">{bikeData?.cc} • {bikeData?.year}</p>
            <p className="text-gray-500 text-xs">{bikeData?.registration_number}</p>
          </div>
        </div>
      </div>
      
      {/* Services */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Selected Services</h3>
        <div className="space-y-3">
          {selectedService?.map((service) => (
            <div key={service.id} className="flex justify-between items-center">
              <div>
                <span className="text-white font-medium">{service.name}</span>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </div>
              <span className="text-red-400 font-semibold">₹{service.price}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Date, Time & Address */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Service Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Date:</span>
            <span className="text-white">{formatDate(slotAndAddress?.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Time:</span>
            <span className="text-white">{formatTime(slotAndAddress?.slot)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Address:</span>
            <span className="text-white text-right max-w-xs">
              {slotAndAddress?.address?.address}, {slotAndAddress?.address?.city} - {slotAndAddress?.address?.pincode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Estimate Requested:</span>
            <span className="text-white">
              {slotAndAddress?.estimate ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Suggestion */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Special Instructions (Optional)</h3>
        <textarea
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          placeholder="Any special instructions or requests for the mechanic..."
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
      </div>
      
      {/* Price Breakdown */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Price Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Subtotal:</span>
            <span className="text-white">₹{promoData.originalTotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Promo Code (SUMMER10):</span>
            <span className="text-green-400">-₹{promoData.discount.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-700 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-white">Total:</span>
              <span className="text-xl font-bold text-red-400">₹{promoData.finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirm Booking Button */}
      <div className="text-center">
        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? 'Confirming Booking...' : 'Confirm Booking'}
        </button>
        <p className="text-gray-500 text-sm mt-3">
          By confirming, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
};

export default SummaryStep;

