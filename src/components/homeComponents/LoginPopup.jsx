import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
// OTP temporarily disabled; login via mobile only
import { setAuthData } from '../../services/authService';

const LoginPopup = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // Reset form when popup opens/closes
  useEffect(() => {
    if (isOpen) {
      setMobile('');
      setOtp(['', '', '', '']);
      setShowOtpField(false);
      setError('');
      setSuccessMessage('');
      setResendTimer(30);
    }
  }, [isOpen]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0 && showOtpField) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer, showOtpField]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next field
      if (value && index < 3) {
        const nextField = document.getElementById(`otp-${index + 1}`);
        if (nextField) nextField.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevField = document.getElementById(`otp-${index - 1}`);
      if (prevField) prevField.focus();
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
    setSuccessMessage('');

    try {
      // Directly authenticate using mobile only (temporary)
      const token = `mobile_${trimmedNumber}_${Date.now()}`;
      const subscriberId = '0';
      const businessId = 3;

      setAuthData(token, subscriberId, businessId);
      localStorage.setItem('mobileNumber', trimmedNumber);
      setSuccessMessage('Login successful!');

      setTimeout(() => {
        onLoginSuccess();
        onClose();
      }, 600);
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong while logging in.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP flow disabled
  const handleSubmitOtp = async () => {};
  const handleResendOtp = () => {};
  const handleBackToMobile = () => {};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Sign In</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showOtpField ? (
            <>
              {/* Mobile Number Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  maxLength={10}
                />
              </div>

              {/* Continue Button */}
              <button
                onClick={handleLoginSubmit}
                disabled={isLoading || mobile.length !== 10}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isLoading ? 'Logging in...' : 'Continue'}
              </button>
            </>
          ) : null}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-900 border border-red-700 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-900 border border-green-700 text-green-300 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Terms */}
          <p className="text-xs text-gray-400 mt-6 text-center">
            By proceeding, you agree to our{' '}
            <span className="text-red-500 cursor-pointer">Privacy Policy</span>,{' '}
            <span className="text-red-500 cursor-pointer">User Agreement</span> and{' '}
            <span className="text-red-500 cursor-pointer">Terms of Service</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
