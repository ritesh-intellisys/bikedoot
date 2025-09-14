import React from 'react'

const Header = ({ currentPage, setCurrentPage }) => {
  const handleNavClick = (page) => {
    setCurrentPage(page)
  }

  const isActive = (page) => {
    return currentPage === page ? 'text-red-500' : 'text-white hover:text-red-400'
  }

  return (
    <header className="bg-black shadow-lg border-b border-gray-800 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 
              className="text-xl font-bold text-white cursor-pointer hover:text-red-400 transition-colors"
              onClick={() => handleNavClick('home')}
            >
              BikeDoot
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('home')}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('shop')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('shop')}`}
            >
              Shop
            </button>
            <button 
              onClick={() => handleNavClick('accessories')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('accessories')}`}
            >
              Accessories
            </button>
            <button 
              onClick={() => handleNavClick('services')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('services')}`}
            >
              Services
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('about')}`}
            >
              About
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('contact')}`}
            >
              Contact
            </button>
          </nav>
          <div className="md:hidden">
            <button className="text-white hover:text-red-400 p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
