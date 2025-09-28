// Authentication service for managing user login state
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const getSubscriberId = () => {
  return localStorage.getItem('subscriberId');
};

export const getBusinessId = () => {
  return localStorage.getItem('businessId');
};

export const setAuthData = (token, subscriberId, businessId) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('subscriberId', subscriberId.toString());
  localStorage.setItem('businessId', businessId.toString());
};

export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('subscriberId');
  localStorage.removeItem('businessId');
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  console.log("🔍 isAuthenticated check - token:", token);
  return !!token;
};

// Debug function to clear all auth data
export const clearAllAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('subscriberId');
  localStorage.removeItem('businessId');
  sessionStorage.removeItem('bookingIntent');
  console.log("🧹 Cleared all authentication data");
};
