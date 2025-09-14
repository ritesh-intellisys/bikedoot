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
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>BikeDoot</h3>
            <p>Redefining cycling culture through innovation, quality, and community engagement.</p>
            <div className="footer-social">
              <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
            </div>
          </div>
          
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={handleHomeClick}>Home</a></li>
              <li><a href="#">Bikes</a></li>
              <li><a href="#">Accessories</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#" onClick={() => handleNavClick('about')}>About Us</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Customer Service</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={() => handleNavClick('contact')}>Contact Us</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Returns & Warranty</a></li>
              <li><a href="#">Shipping Information</a></li>
              <li><a href="#">Size Guide</a></li>
              </ul>
          </div>
          
          <div className="footer-col">
            <h3>Contact Info</h3>
            <ul className="footer-links">
              <li><FontAwesomeIcon icon={faMapMarkerAlt} /> 123 Cycling Street, Bike City</li>
              <li><FontAwesomeIcon icon={faPhone} /> (555) 123-4567</li>
              <li><FontAwesomeIcon icon={faEnvelope} /> info@bikedoot.com</li>
              <li><FontAwesomeIcon icon={faClock} /> Mon-Sat: 9AM - 6PM</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2023 BikeDoot. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
