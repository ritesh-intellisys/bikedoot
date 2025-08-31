import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faShieldAlt,
  faTools,
  faCar,
  faMotorcycle,
  faTruck
} from '@fortawesome/free-solid-svg-icons';
import { 
  faTwitter, 
  faFacebook, 
  faInstagram, 
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';

const Footer = ({ setCurrentPage }) => {
  const handleNavClick = (page) => {
    setCurrentPage(page)
  }

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">BikeDoot</h3>
            <p className="text-gray-300 text-sm mb-4">
              Your trusted partner for all vehicle services. Find verified garages, compare prices, and get quality service for 2-wheelers, 4-wheelers, and commercial vehicles.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">
                <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">
                <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">
                <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleNavClick('home')}
                  className="text-gray-300 hover:text-pink-500 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('garages')}
                  className="text-gray-300 hover:text-pink-500 transition-colors"
                >
                  Find Garages
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('services')}
                  className="text-gray-300 hover:text-pink-500 transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('about')}
                  className="text-gray-300 hover:text-pink-500 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('contact')}
                  className="text-gray-300 hover:text-pink-500 transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Customer Service</h4>
                          <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">Track Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">Service History</a></li>
                <li><a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">Garage Reviews</a></li>
                <li><a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">FAQ</a></li>
              </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-pink-500 w-4 h-4" />
                <p className="text-gray-300">
                  123 Service Street<br />
                  Pune, Maharashtra 411001
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faPhone} className="text-pink-500 w-4 h-4" />
                <p className="text-gray-300">+91 (020) 123-4567</p>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-pink-500 w-4 h-4" />
                <p className="text-gray-300">support@bikedoot.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2024 BikeDoot. All rights reserved. | Your trusted vehicle service partner.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
