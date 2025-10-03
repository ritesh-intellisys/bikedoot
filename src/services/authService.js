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
  
  // Create session marker to track this session
  const sessionId = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('authSession', sessionId);
  
  console.log("✅ Auth data saved with session:", sessionId);
  
  // Trigger authentication state change event
  window.dispatchEvent(new CustomEvent('authStateChanged', { 
    detail: { isLoggedIn: true } 
  }));
};

export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('subscriberId');
  localStorage.removeItem('businessId');
  sessionStorage.removeItem('authSession');
  
  console.log("🧹 Auth data cleared");
  
  // Trigger authentication state change event
  window.dispatchEvent(new CustomEvent('authStateChanged', { 
    detail: { isLoggedIn: false } 
  }));
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  const subscriberId = getSubscriberId();
  const businessId = getBusinessId();
  
  console.log("🔍 isAuthenticated check - token:", token, "subscriberId:", subscriberId, "businessId:", businessId);
  
  // Check if all required auth data exists
  if (!token || !subscriberId || !businessId) {
    console.log("❌ Missing auth data, user not authenticated");
    return false;
  }
  
  // Check if token format is valid (but don't clear auth data automatically)
  try {
    if (token.length < 10) {
      console.log("❌ Invalid token format");
      return false;
    }
    
    console.log("✅ User is authenticated");
    return true;
  } catch (error) {
    console.log("❌ Token validation failed:", error);
    return false;
  }
};

// Check if session should be maintained (same device, not expired)
export const isSessionValid = () => {
  const sessionMarker = sessionStorage.getItem('authSession');
  const token = getAuthToken();
  
  // If no session marker, this is a new device/session
  if (!sessionMarker) {
    console.log("🔄 New device/session detected, requiring fresh login");
    return false;
  }
  
  // If no token, session is invalid
  if (!token) {
    console.log("🔄 No token found, session invalid");
    return false;
  }
  
  // Check if session is too old (24 hours max)
  const sessionTime = parseInt(sessionMarker.split('_')[1]);
  const currentTime = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  if (currentTime - sessionTime > maxAge) {
    console.log("🔄 Session expired (older than 24 hours)");
    clearAuthData();
    return false;
  }
  
  console.log("✅ Session is valid");
  return true;
};

// Initialize session management
export const initializeSession = () => {
  // Only clear auth data if this is truly a new session (no existing session marker)
  const existingSession = sessionStorage.getItem('authSession');
  const existingAuth = localStorage.getItem('authToken');
  
  // Only clear if there's no session marker AND no existing auth data
  if (!existingSession && !existingAuth) {
    console.log("🔄 New session detected, no existing auth data to clear");
  } else if (!existingSession && existingAuth) {
    // If there's auth data but no session marker, create a new session marker
    console.log("🔄 Restoring session for existing auth data");
    const sessionId = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('authSession', sessionId);
  }
  
  // Set up beforeunload event to clear session on tab close
  const handleBeforeUnload = () => {
    console.log("🔄 Tab closing, clearing session");
    sessionStorage.removeItem('authSession');
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};

// Debug function to clear all auth data
export const clearAllAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('subscriberId');
  localStorage.removeItem('businessId');
  sessionStorage.removeItem('authSession');
  sessionStorage.removeItem('bookingIntent');
  console.log("🧹 Cleared all authentication data");
  
  // Trigger authentication state change event
  window.dispatchEvent(new CustomEvent('authStateChanged', { 
    detail: { isLoggedIn: false } 
  }));
};
