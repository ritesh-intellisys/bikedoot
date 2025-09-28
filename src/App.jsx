import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Profile from './pages/Profile'
import Login from './pages/Login'
import BookingFlow from './components/homeComponents/BookingFlow'
import { isAuthenticated } from './services/authService'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check authentication status on app load
  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutUs setCurrentPage={setCurrentPage} />
      case 'contact':
        return <ContactUs setCurrentPage={setCurrentPage} />
      case 'login':
        return <Login setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />
      case 'profile':
        // Protect profile route - redirect to login if not authenticated
        if (!isLoggedIn) {
          setCurrentPage('login')
          return <Login setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />
        }
        return <Profile setCurrentPage={setCurrentPage} />
      case 'home':
      default:
        return <Home setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Routes>
          <Route path="/" element={renderPage()} />
          <Route path="/booking" element={<BookingFlow />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
