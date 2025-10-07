import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../pages/AboutUs.css';
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

const Footer = ({ setCurrentPage, scrollToTop }) => {
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
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="footer-col">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">ServX24</h3>
            <p className="text-sm md:text-base text-gray-300 mb-4">Redefining cycling culture through innovation, quality, and community engagement.</p>
            <div className="footer-social flex space-x-3">
              <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <FontAwesomeIcon icon={faFacebook} className="text-sm md:text-base" />
              </a>
              <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <FontAwesomeIcon icon={faTwitter} className="text-sm md:text-base" />
              </a>
              <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="text-sm md:text-base" />
              </a>
              <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <FontAwesomeIcon icon={faYoutube} className="text-sm md:text-base" />
              </a>
            </div>
          </div>
          
          <div className="footer-col">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">Quick Links</h3>
            <ul className="footer-links space-y-2">
              <li><a href="#" onClick={handleHomeClick} className="text-sm md:text-base text-gray-300 hover:text-red-500 transition-colors">Home</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-300 hover:text-red-500 transition-colors">Bikes</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-300 hover:text-red-500 transition-colors">Accessories</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-300 hover:text-red-500 transition-colors">Services</a></li>
              <li><a href="#" onClick={() => handleNavClick('about')} className="text-sm md:text-base text-gray-300 hover:text-red-500 transition-colors">About Us</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">Customer Service</h3>
            <ul className="footer-links space-y-2">
              <li><a href="#" onClick={() => handleNavClick('contact')} className="text-sm md:text-base text-gray-300 hover:text-red-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-300 hover:text-red-500 transition-colors">FAQs</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-300 hover:text-red-500 transition-colors">Returns & Warranty</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-300 hover:text-red-500 transition-colors">Shipping Information</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-300 hover:text-red-500 transition-colors">Size Guide</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">Contact Info</h3>
            <ul className="footer-links space-y-2">
              <li className="flex items-center text-sm md:text-base text-gray-300">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3 md:w-4 md:h-4 mr-2 text-red-500" /> 
                Near, Hinjawadi - Wakad Rd, opp. Vijay Sales, Pune, Maharashtraa, 222001
              </li>
              <li className="flex items-center text-sm md:text-base text-gray-300">
                <FontAwesomeIcon icon={faPhone} className="w-3 h-3 md:w-4 md:h-4 mr-2 text-red-500" /> 
                +91 62076 27817
              </li>
              <li className="flex items-center text-sm md:text-base text-gray-300">
                <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 md:w-4 md:h-4 mr-2 text-red-500" /> 
                info@bikedoot.com
              </li>
              <li className="flex items-center text-sm md:text-base text-gray-300">
                <FontAwesomeIcon icon={faClock} className="w-3 h-3 md:w-4 md:h-4 mr-2 text-red-500" /> 
                Mon-Sat: 9AM - 6PM
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom border-t border-gray-800 mt-6 md:mt-8 pt-4 md:pt-6">
          <p className="text-center text-xs md:text-sm text-gray-400">Copyright © 2025 ServX24 | info@bikedoot.com</p>
          <p className="text-center text-xs md:text-sm text-gray-400 mt-1">Call us: +91 62076 27817</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
