import React, { useState, useEffect, useRef } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const [activeFaq, setActiveFaq] = useState(null);

  const contactSectionRef = useRef(null);
  const faqSectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const faqItems = [
    {
      question: "What are your business hours?",
      answer: "We're available Monday to Saturday from 9:00 AM to 6:00 PM. Our support team responds to emails within 24 hours."
    },
    {
      question: "How long does bike servicing take?",
      answer: "Standard service takes 2-3 hours, while comprehensive service may take 4-6 hours. We offer express options for basic maintenance."
    },
    {
      question: "Do you offer home service?",
      answer: "Yes, we provide home service for bike repairs and maintenance in select areas. Additional charges may apply based on location."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, credit/debit cards, UPI payments, and all major digital wallets for your convenience."
    },
    {
      question: "Do you sell genuine spare parts?",
      answer: "Absolutely! We only use genuine and high-quality spare parts with warranties for all our repairs and services."
    }
  ];

  const contactMethods = [
    {
      icon: "fas fa-map-marker-alt",
      title: "Visit Our Store",
      details: "123 Cycling Street, Bike City, 560001",
      description: "Come visit us for a test ride or consultation",
      color: "#FF6B6B"
    },
    {
      icon: "fas fa-phone",
      title: "Call Us",
      details: "+91 98765 43210",
      description: "Mon-Sat: 9AM - 6PM | Sun: Closed",
      color: "#4ECDC4"
    },
    {
      icon: "fas fa-envelope",
      title: "Email Us",
      details: "info@bikedoot.com",
      description: "We'll respond within 24 hours",
      color: "#FFD166"
    },
    {
      icon: "fas fa-clock",
      title: "Business Hours",
      details: "Monday - Saturday",
      description: "9:00 AM - 6:00 PM",
      color: "#6A0572"
    }
  ];

  return (
    <div className="bikedoot-contact">
      {/* Header */}
      <header className={isScrolled ? 'scrolled' : ''}>
        <div className="container header-container">
          <a href="#" className="logo">
            <i className="fas fa-bicycle"></i>
            Bike<span>Doot</span>
          </a>
          
          <div className="menu-toggle" onClick={toggleMenu}>
            <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
          </div>
          
         <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
  <li><a href="#" onClick={() => alert("Home Clicked!")}>Home</a></li>
  <li><a href="#" onClick={() => alert("Bikes Clicked!")}>Bikes</a></li>
  <li><a href="#" onClick={() => alert("Accessories Clicked!")}>Accessories</a></li>
  <li><a href="#" onClick={() => alert("Services Clicked!")}>Services</a></li>
  <li><a href="AboutUs" onClick={() => alert("About Clicked!")}>About</a></li>
  <li><a href="ContactUs" onClick={() => alert("Contact Clicked!")}>Contact</a></li>
</ul>

          
          <div className="header-actions">
            <a href="#"><i className="fas fa-search"></i></a>
            <a href="#"><i className="fas fa-shopping-cart"></i></a>
            <a href="#"><i className="fas fa-user"></i></a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="floating-elements">
          <div className="floating-element">📞</div>
          <div className="floating-element">✉️</div>
          <div className="floating-element">📍</div>
          <div className="floating-element">🚴</div>
        </div>
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Connect With BikeDoot</h1>
              <p>We're here to help you with all your cycling needs. Get in touch with our team of experts.</p>
              <div className="hero-buttons">
                <a href="#contact-form" className="btn">Send Message</a>
                <a href="#locations" className="btn btn-secondary">Visit Our Store</a>
              </div>
            </div>
            <div className="hero-image">
              <img src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="BikeDoot Contact" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="contact-methods">
        <div className="container">
          <div className="section-title">
            <h2>Multiple Ways to Connect</h2>
            <p>Choose your preferred method to reach out to us</p>
          </div>
          
          <div className="methods-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className="method-card">
                <div className="method-icon" style={{ backgroundColor: method.color }}>
                  <i className={method.icon}></i>
                </div>
                <h3>{method.title}</h3>
                <p className="method-details">{method.details}</p>
                <p className="method-description">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="content-tabs">
        <div className="container">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <i className="fas fa-envelope"></i> Contact Form
            </button>
            <button 
              className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              <i className="fas fa-question-circle"></i> FAQ
            </button>
            <button 
              className={`tab-btn ${activeTab === 'locations' ? 'active' : ''}`}
              onClick={() => setActiveTab('locations')}
            >
              <i className="fas fa-map-marker-alt"></i> Our Locations
            </button>
          </div>
          
          <div className="tab-content">
            {/* Contact Form */}
            {activeTab === 'contact' && (
              <div className="contact-form-section" ref={contactSectionRef}>
                <div className="form-container">
                  <div className="form-header">
                    <h3>Send us a Message</h3>
                    <p>Fill out the form below and we'll get back to you as soon as possible</p>
                  </div>
                  
                  {isSubmitted ? (
                    <div className="success-message">
                      <i className="fas fa-check-circle"></i>
                      <h3>Thank You for Your Message!</h3>
                      <p>We've received your inquiry and will respond within 24 hours.</p>
                    </div>
                  ) : (
                    <form className="contact-form" onSubmit={handleSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="name">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="phone">Phone Number</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="subject">Subject</label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select a subject</option>
                            <option value="service">Bike Service</option>
                            <option value="sales">Product Sales</option>
                            <option value="repair">Repair Inquiry</option>
                            <option value="parts">Spare Parts</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                      
                      <button type="submit" className="btn form-submit-btn">
                        <i className="fas fa-paper-plane"></i> Send Message
                      </button>
                    </form>
                  )}
                </div>
                
                <div className="form-info">
                  <h3>Why Contact Us?</h3>
                  <ul>
                    <li><i className="fas fa-check"></i> Expert advice from cycling enthusiasts</li>
                    <li><i className="fas fa-check"></i> Quick response within 24 hours</li>
                    <li><i className="fas fa-check"></i> Custom solutions for your needs</li>
                    <li><i className="fas fa-check"></i> Best prices guaranteed</li>
                    <li><i className="fas fa-check"></i> Professional after-sales support</li>
                  </ul>
                  
                  <div className="emergency-contact">
                    <h4><i className="fas fa-ambulance"></i> Emergency Service?</h4>
                    <p>Call our hotline for immediate assistance</p>
                    <a href="tel:+919876543210" className="emergency-btn">
                      <i className="fas fa-phone"></i> +91 98765 43210
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {/* FAQ Section */}
            {activeTab === 'faq' && (
              <div className="faq-section" ref={faqSectionRef}>
                <h3>Frequently Asked Questions</h3>
                <p>Find quick answers to common questions about our products and services</p>
                
                <div className="faq-list">
                  {faqItems.map((item, index) => (
                    <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                      <div className="faq-question" onClick={() => toggleFaq(index)}>
                        <h4>{item.question}</h4>
                        <i className={`fas fa-chevron-${activeFaq === index ? 'up' : 'down'}`}></i>
                      </div>
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Locations Section */}
            {activeTab === 'locations' && (
              <div className="locations-section">
                <h3>Our Store Locations</h3>
                <p>Visit us at any of our conveniently located stores</p>
                
                <div className="locations-grid">
                  <div className="location-card">
                    <div className="location-image">
                      <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="BikeDoot Main Store" />
                      <div className="location-overlay">
                        <span className="location-tag">Flagship Store</span>
                      </div>
                    </div>
                    <div className="location-info">
                      <h4>BikeDoot Main Store</h4>
                      <p><i className="fas fa-map-marker-alt"></i> 123 Cycling Street, Bike City, 560001</p>
                      <p><i className="fas fa-phone"></i> +91 98765 43210</p>
                      <p><i className="fas fa-clock"></i> Mon-Sat: 9AM-6PM</p>
                      <button className="btn location-btn">Get Directions</button>
                    </div>
                  </div>
                  
                  <div className="location-card">
                    <div className="location-image">
                      <img src="https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="BikeDoot West Branch" />
                      <div className="location-overlay">
                        <span className="location-tag">Service Center</span>
                      </div>
                    </div>
                    <div className="location-info">
                      <h4>BikeDoot West Branch</h4>
                      <p><i className="fas fa-map-marker-alt"></i> 456 Rider's Avenue, West City, 560002</p>
                      <p><i className="fas fa-phone"></i> +91 98765 43211</p>
                      <p><i className="fas fa-clock"></i> Mon-Sat: 9AM-6PM</p>
                      <button className="btn location-btn">Get Directions</button>
                    </div>
                  </div>
                  
                  <div className="location-card">
                    <div className="location-image">
                      <img src="https://images.unsplash.com/photo-1511994298241-608e28f14fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="BikeDoot East Branch" />
                      <div className="location-overlay">
                        <span className="location-tag">Sales & Service</span>
                      </div>
                    </div>
                    <div className="location-info">
                      <h4>BikeDoot East Branch</h4>
                      <p><i className="fas fa-map-marker-alt"></i> 789 Pedal Road, East City, 560003</p>
                      <p><i className="fas fa-phone"></i> +91 98765 43212</p>
                      <p><i className="fas fa-clock"></i> Mon-Sat: 9AM-6PM</p>
                      <button className="btn location-btn">Get Directions</button>
                    </div>
                  </div>
                </div>
                
                <div className="map-container">
                  <h4>Find Us on Map</h4>
                  <div className="map-placeholder">
                    <i className="fas fa-map-marked-alt"></i>
                    <p>Interactive Map Would Appear Here</p>
                    <small>Integration with Google Maps API</small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Still Have Questions?</h2>
            <p>Our customer support team is always ready to help you with any inquiries</p>
            <div className="cta-buttons">
              <a href="tel:+919876543210" className="btn">
                <i className="fas fa-phone"></i> Call Now
              </a>
              <a href="mailto:info@bikedoot.com" className="btn btn-secondary">
                <i className="fas fa-envelope"></i> Email Us
              </a>
              <a href="#" className="btn btn-outline">
                <i className="fas fa-comments"></i> Live Chat
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>BikeDoot</h3>
              <p>Redefining cycling culture through innovation, quality, and community engagement.</p>
              <div className="footer-social">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
                <a href="#"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>
            
            <div className="footer-col">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#"><i className="fas fa-chevron-right"></i> Home</a></li>
                <li><a href="#"><i className="fas fa-chevron-right"></i> Bikes</a></li>
                <li><a href="#"><i className="fas fa-chevron-right"></i> Accessories</a></li>
                <li><a href="#"><i className="fas fa-chevron-right"></i> Services</a></li>
                <li><a href="#"><i className="fas fa-chevron-right"></i> About Us</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h3>Customer Service</h3>
              <ul className="footer-links">
                <li><a href="#"><i className="fas fa-chevron-right"></i> Contact Us</a></li>
                <li><a href="#"><i className="fas fa-chevron-right"></i> FAQs</a></li>
                <li><a href="#"><i className="fas fa-chevron-right"></i> Returns & Warranty</a></li>
                <li><a href="#"><i className="fas fa-chevron-right"></i> Shipping Information</a></li>
                <li><a href="#"><i className="fas fa-chevron-right"></i> Size Guide</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h3>Contact Info</h3>
              <ul className="footer-links">
                <li><i className="fas fa-map-marker-alt"></i> 123 Cycling Street, Bike City</li>
                <li><i className="fas fa-phone"></i> +91 98765 43210</li>
                <li><i className="fas fa-envelope"></i> info@bikedoot.com</li>
                <li><i className="fas fa-clock"></i> Mon-Sat: 9AM - 6PM</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2023 BikeDoot. All Rights Reserved. | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;