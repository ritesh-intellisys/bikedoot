import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import BookingFlow from './components/homeComponents/BookingFlow'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutUs setCurrentPage={setCurrentPage} />
      case 'contact':
        return <ContactUs setCurrentPage={setCurrentPage} />
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
