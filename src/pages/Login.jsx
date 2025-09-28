import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  CheckIcon,
  PhoneIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { sendSMS, verifyOtp } from '../services/smsService';
import { setAuthData } from '../services/authService';

const Login = ({ setCurrentPage, setIsLoggedIn }) => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showOtpField, setShowOtpField] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let timer;
    if (showOtpField && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpField, resendTimer]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleLoginSubmit = async () => {
    const trimmedNumber = mobile.trim();

    if (!/^\d{10}$/.test(trimmedNumber)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const businessId = 3;
      const response = await sendSMS(businessId, trimmedNumber);

      if (response.status) {
        setSuccessMessage('OTP sent successfully!');
        setShowOtpField(true);
        setResendTimer(30);
        setError('');
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong while sending OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOtp = async () => {
    const otpString = otp.join('');

    if (otpString.length < 4) {
      setError('Please enter a valid 4-digit OTP.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const businessId = 3;
      const response = await verifyOtp({ businessid: businessId, mobile, otp: otpString });

      if (response.status) {
        const { token, subscriber_id, business_id } = response.data;

        // Save authentication data
        setAuthData(token, subscriber_id, business_id);
        
        // Store mobile number for profile reference
        localStorage.setItem('mobileNumber', mobile);
        
        setIsLoggedIn(true);
        setSuccessMessage('Login successful!');

        // Check if user came from booking flow
        const urlParams = new URLSearchParams(window.location.search);
        const returnTo = urlParams.get('returnTo');
        const garageId = urlParams.get('garageId');
        const vehicleType = urlParams.get('vehicleType');
        
        // Also check sessionStorage for booking intent
        const bookingIntent = sessionStorage.getItem('bookingIntent');
        let bookingData = null;
        
        if (bookingIntent) {
          try {
            bookingData = JSON.parse(bookingIntent);
            // Clear the booking intent after reading
            sessionStorage.removeItem('bookingIntent');
          } catch (e) {
            console.error('Error parsing booking intent:', e);
          }
        }
        
        // Redirect based on where user came from
        setTimeout(() => {
          if ((returnTo === 'booking' && garageId) || bookingData) {
            // Redirect back to booking flow
            const finalGarageId = garageId || bookingData?.garageId;
            const finalVehicleType = vehicleType || bookingData?.vehicleType || 'two-wheeler';
            window.location.href = `/booking?garageId=${finalGarageId}&returnTo=garage-list&vehicleType=${finalVehicleType}`;
          } else if (returnTo === 'home' || bookingData?.returnTo === 'home') {
            // Redirect to home page
            setCurrentPage('home');
          } else {
            // Default redirect to profile
            setCurrentPage('profile');
          }
        }, 1500);
      } else {
        setError(response.message || 'OTP verification failed.');
      }
    } catch (error) {
      console.error('OTP submit error:', error);
      setError('Something went wrong while verifying OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setResendTimer(30);
    handleLoginSubmit();
  };

  const handleBackToMobile = () => {
    setShowOtpField(false);
    setOtp(['', '', '', '']);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Sign In</h1>
                <p className="text-gray-400 mt-1">Enter your mobile number to continue</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Benefits Section */}
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-6">Unlock These Benefits</h2>
            
            <div className="space-y-6">
              {[
                {
                  title: 'Trusted Garages',
                  desc: 'Quality service at verified garages near you',
                  icon: ShieldCheckIcon,
                  color: 'text-green-500'
                },
                {
                  title: 'Transparent Pricing',
                  desc: 'Know your service costs upfront with no hidden charges',
                  icon: CurrencyDollarIcon,
                  color: 'text-yellow-500'
                },
                {
                  title: 'Certified Mechanics',
                  desc: 'Experienced and certified mechanics ensuring top-quality repairs',
                  icon: WrenchScrewdriverIcon,
                  color: 'text-blue-500'
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center ${benefit.color}`}>
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Offer */}
            <div className="mt-8 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-full bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-white font-bold text-lg">UPTO 12% OFF*</p>
                  <p className="text-gray-300 text-sm">Enjoy hassle-free doorstep servicing</p>
                  <p className="text-red-400 text-sm font-medium">On‑demand service at your fingertips</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <div className="mb-6">
              <button
                onClick={handleBackToMobile}
                className={`text-gray-400 hover:text-white transition-colors mb-4 ${!showOtpField ? 'hidden' : ''}`}
              >
                ← Back to mobile number
              </button>
              
              <h3 className="text-lg font-semibold text-white mb-2">
                {showOtpField ? 'Enter OTP' : 'Sign In'}
              </h3>
              <p className="text-gray-400 text-sm">
                {showOtpField 
                  ? `We've sent a 4-digit code to ${mobile}` 
                  : 'Enter your mobile number to get started'
                }
              </p>
            </div>

            {showOtpField ? (
              <>
                {/* OTP Input */}
                <div className="flex justify-center space-x-3 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      maxLength={1}
                      className="w-16 h-16 text-center text-2xl font-bold bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  ))}
                </div>

                <button
                  onClick={handleSubmitOtp}
                  disabled={otp.some((digit) => digit === '') || isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors mb-4"
                >
                  {isLoading ? 'Verifying...' : 'Submit OTP'}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-gray-400 text-sm">
                      Resend OTP in {resendTimer}s
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      className="text-red-500 hover:text-red-400 text-sm font-medium"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Mobile Input */}
                <div className="mb-6">
                  <label className="block text-gray-400 text-sm mb-2">Mobile Number</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                    {mobile && (
                      <button
                        onClick={() => {
                          setMobile('');
                          setError('');
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleLoginSubmit}
                  disabled={!mobile || isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors mb-4"
                >
                  {isLoading ? 'Sending OTP...' : 'Continue'}
                </button>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-900 bg-opacity-20 border border-green-800 text-green-300 px-4 py-3 rounded-lg text-sm mb-4 flex items-center space-x-2">
                <CheckIcon className="w-4 h-4" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Terms */}
            <p className="text-gray-400 text-xs text-center mt-6">
              By proceeding, you agree to our{' '}
              <span className="text-red-400 cursor-pointer hover:underline">Privacy Policy</span>,{' '}
              <span className="text-red-400 cursor-pointer hover:underline">User Agreement</span> and{' '}
              <span className="text-red-400 cursor-pointer hover:underline">Terms of Service</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
