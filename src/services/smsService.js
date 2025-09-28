// SMS service for OTP functionality
const API_URL = import.meta.env.VITE_API_URL || 'https://workshop.bikedoot.com/api';

export const sendSMS = async (businessid, mobile) => {
  const url = `${API_URL}/send-sms/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ businessid, mobile }),
    });

    const resData = await response.json();
    console.log("🔍 SMS API response:", resData);

    if (resData.status === true) {
      return {
        status: true,
        message: resData.message || "OTP sent",
        otp: resData.otp || null,
      };
    } else {
      return {
        status: false,
        message: resData.message || "Failed to send OTP",
      };
    }
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
    return {
      status: false,
      message: "Failed to send SMS",
    };
  }
};

export const verifyOtp = async ({ businessid, mobile, otp }) => {
  try {
    const response = await fetch(`${API_URL}/verify-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ businessid, mobile, otp }),
    });

    const resData = await response.json();
    console.log("🔍 OTP verification response:", resData);

    return resData;
  } catch (error) {
    console.error('OTP verification failed:', error);
    return {
      status: false,
      message: error?.response?.data?.message || 'Something went wrong',
    };
  }
};
