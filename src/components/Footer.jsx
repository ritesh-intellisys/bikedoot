import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { 
  faTwitter, 
  faFacebook, 
  faInstagram, 
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import { useTheme } from './context/ThemeContext';

const Footer = ({ setCurrentPage, scrollToTop }) => {
  const { theme } = useTheme();
  const handleNavClick = (page) => {
    setCurrentPage(page)
  }

  const handleHomeClick = () => {
    setCurrentPage('home');
    if (scrollToTop) {
      scrollToTop();
    }
  }

  return (
    <footer className={`${theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="footer-col">
            <h3 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${theme === 'light' ? '!text-black' : 'text-white'}`}>ServX24</h3>
            <p className={`text-sm md:text-base mb-4 ${theme === 'light' ? '!text-black' : 'text-gray-300'}`}>Elevating vehicle maintenance through innovation, quality service, and community connection.</p>
            <div className="footer-social flex space-x-3">
              <a
                href="#"
                aria-label="Facebook"
                title="Facebook"
                className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 shadow-sm ${theme === 'light' ? '!bg-white border-2 border-black !text-black hover:!bg-black hover:!text-white focus-visible:!ring-black' : 'bg-gray-800 border border-gray-700 text-white hover:bg-red-600 focus-visible:ring-red-500'}`}
              >
                <FontAwesomeIcon icon={faFacebook} className="text-base md:text-lg" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                title="Twitter"
                className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 shadow-sm ${theme === 'light' ? '!bg-white border-2 border-black !text-black hover:!bg-black hover:!text-white focus-visible:!ring-black' : 'bg-gray-800 border border-gray-700 text-white hover:bg-red-600 focus-visible:ring-red-500'}`}
              >
                <FontAwesomeIcon icon={faTwitter} className="text-base md:text-lg" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                title="Instagram"
                className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 shadow-sm ${theme === 'light' ? '!bg-white border-2 border-black !text-black hover:!bg-black hover:!text-white focus-visible:!ring-black' : 'bg-gray-800 border border-gray-700 text-white hover:bg-red-600 focus-visible:ring-red-500'}`}
              >
                <FontAwesomeIcon icon={faInstagram} className="text-base md:text-lg" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                title="YouTube"
                className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 shadow-sm ${theme === 'light' ? '!bg-white border-2 border-black !text-black hover:!bg-black hover:!text-white focus-visible:!ring-black' : 'bg-gray-800 border border-gray-700 text-white hover:bg-red-600 focus-visible:ring-red-500'}`}
              >
                <FontAwesomeIcon icon={faYoutube} className="text-base md:text-lg" />
              </a>
            </div>
          </div>
          
          <div className="footer-col">
            <h3 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${theme === 'light' ? '!text-black' : 'text-white'}`}>Quick Links</h3>
            <ul className="footer-links space-y-2">
              <li><a href="#" onClick={handleHomeClick} className={`text-sm md:text-base transition-colors ${theme === 'light' ? '!text-black visited:!text-black hover:!text-black' : 'text-gray-300 hover:text-red-500'}`}>Home</a></li>
              <li><a href="#" className={`text-sm md:text-base transition-colors ${theme === 'light' ? '!text-black visited:!text-black hover:!text-black' : 'text-gray-300 hover:text-red-500'}`}>Bikes</a></li>
              <li><a href="#" className={`text-sm md:text-base transition-colors ${theme === 'light' ? '!text-black visited:!text-black hover:!text-black' : 'text-gray-300 hover:text-red-500'}`}>Accessories</a></li>
              <li><a href="#" className={`text-sm md:text-base transition-colors ${theme === 'light' ? '!text-black visited:!text-black hover:!text-black' : 'text-gray-300 hover:text-red-500'}`}>Services</a></li>
              <li><a href="#" onClick={() => handleNavClick('about')} className={`text-sm md:text-base transition-colors ${theme === 'light' ? '!text-black visited:!text-black hover:!text-black' : 'text-gray-300 hover:text-red-500'}`}>About Us</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${theme === 'light' ? '!text-black' : 'text-white'}`}>Customer Service</h3>
            <ul className="footer-links space-y-2">
              <li><a href="#" onClick={() => handleNavClick('contact')} className={`text-sm md:text-base transition-colors ${theme === 'light' ? '!text-black visited:!text-black hover:!text-black' : 'text-gray-300 hover:text-red-500'}`}>Contact Us</a></li>
              <li><a href="#" className={`text-sm md:text-base transition-colors ${theme === 'light' ? '!text-black visited:!text-black hover:!text-black' : 'text-gray-300 hover:text-red-500'}`}>FAQs</a></li>
              <li><a href="#" className={`text-sm md:text-base transition-colors ${theme === 'light' ? '!text-black visited:!text-black hover:!text-black' : 'text-gray-300 hover:text-red-500'}`}>Returns & Warranty</a></li>
              <li><a href="#" className={`text-sm md:text-base transition-colors ${theme === 'light' ? '!text-black visited:!text-black hover:!text-black' : 'text-gray-300 hover:text-red-500'}`}>Shipping Information</a></li>
              <li><a href="#" className={`text-sm md:text-base transition-colors ${theme === 'light' ? '!text-black visited:!text-black hover:!text-black' : 'text-gray-300 hover:text-red-500'}`}>Size Guide</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${theme === 'light' ? '!text-black' : 'text-white'}`}>Contact Info</h3>
            <ul className="footer-links space-y-2">
              <li className={`flex items-center text-sm md:text-base ${theme === 'light' ? '!text-black' : 'text-gray-300'}`}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3 md:w-4 md:h-4 mr-2 text-red-500" /> 
                Near, Hinjawadi - Wakad Rd, opp. Vijay Sales, Pune, Maharashtraa, 222001
              </li>
              <li className={`flex items-center text-sm md:text-base ${theme === 'light' ? '!text-black' : 'text-gray-300'}`}>
                <FontAwesomeIcon icon={faPhone} className="w-3 h-3 md:w-4 md:h-4 mr-2 text-red-500" /> 
                +91 62076 27817
              </li>
              <li className={`flex items-center text-sm md:text-base ${theme === 'light' ? '!text-black' : 'text-gray-300'}`}>
                <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 md:w-4 md:h-4 mr-2 text-red-500" /> 
              info@servx24.com
              </li>
              <li className={`flex items-center text-sm md:text-base ${theme === 'light' ? '!text-black' : 'text-gray-300'}`}>
                <FontAwesomeIcon icon={faClock} className="w-3 h-3 md:w-4 md:h-4 mr-2 text-red-500" /> 
                Mon-Sat: 9AM - 6PM
              </li>
            </ul>
          </div>
        </div>
        
        <div className={`footer-bottom mt-6 md:mt-8 pt-4 md:pt-6 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'}`}>
          <p className={`text-center text-xs md:text-sm ${theme === 'light' ? 'text-black' : 'text-gray-400'}`}>Copyright © 2025 ServX24 | info@servx24.com</p>
          <p className={`text-center text-xs md:text-sm mt-1 ${theme === 'light' ? 'text-black' : 'text-gray-400'}`}>Call us: +91 62076 27817</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
