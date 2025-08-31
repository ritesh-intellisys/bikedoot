import React, { useState } from 'react'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'

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
    <div className="min-h-screen bg-black">
      {renderPage()}
    </div>
  )
}

export default App
