import React, { useState, useEffect, useRef } from 'react';
import './ContactUs.css';
import Header from '../components/homeComponents/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt, faPhone, faEnvelope, faClock, faSearch,
  faShoppingCart, faUser, faTimes, faBars, faCheck, faPaperPlane,
  faQuestionCircle, faChevronDown, faChevronUp, faAmbulance,
  faMapMarkedAlt, faComments, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook, faTwitter, faInstagram, faYoutube, faWhatsapp
} from '@fortawesome/free-brands-svg-icons';

const ContactUs = ({ setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
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
      icon: faMapMarkerAlt,
      title: "Visit Our Store",
      details: "Near, Hinjawadi - Wakad Rd, opp. Vijay Sales, Pune, Maharashtraa, 2220011",
      description: "Come visit us for a test ride or consultation",
      color: "#FF6B6B"
    },
    {
      icon: faPhone,
      title: "Call Us",
      details: "+91 62076 27817",
      description: "Mon-Sat: 9AM - 6PM | Sun: Closed",
      color: "#4ECDC4"
    },
    {
      icon: faEnvelope,
      title: "Email Us",
      details: "info@servx24.com",
      description: "We'll respond within 24 hours",
      color: "#FFD166"
    },
    {
      icon: faClock,
      title: "Business Hours",
      details: "Monday - Saturday",
      description: "9:00 AM - 6:00 PM",
      color: "#6A0572"
    }
  ];

  return (
    <div className="servx24-contact">
      {/* Header */}
      <Header 
        selectedCity={selectedCity} 
        onCityChange={setSelectedCity} 
        setCurrentPage={setCurrentPage}
        scrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onBackToMain={() => setCurrentPage('home')}
      />

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
              <h1>Connect With ServX24</h1>
              <p>We're here to help you with all your Vehicle needs. Get in touch with our team of experts.</p>
              <div className="hero-buttons">
                <a href="#contact-form" className="btn">Send Message</a>
              </div>
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
                  <FontAwesomeIcon icon={method.icon} />
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
              <FontAwesomeIcon icon={faEnvelope} /> Contact Form
            </button>
            <button 
              className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              <FontAwesomeIcon icon={faQuestionCircle} /> FAQ
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
                      <FontAwesomeIcon icon={faCheck} />
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
                        <FontAwesomeIcon icon={faPaperPlane} /> Send Message
                      </button>
                    </form>
                  )}
                </div>
                
                <div className="form-info">
                  <h3>Why Contact Us?</h3>
                  <ul>
                    <li><FontAwesomeIcon icon={faCheck} /> Expert advice from automotive professionals</li>
                    <li><FontAwesomeIcon icon={faCheck} /> Quick response within 24 hours</li>
                    <li><FontAwesomeIcon icon={faCheck} /> Custom solutions for your needs</li>
                    <li><FontAwesomeIcon icon={faCheck} /> Best prices guaranteed</li>
                    <li><FontAwesomeIcon icon={faCheck} /> Professional after-sales support</li>
                  </ul>
                  
                  <div className="emergency-contact">
                    <h4><FontAwesomeIcon icon={faAmbulance} /> Emergency Service?</h4>
                    <p>Call our hotline for immediate assistance</p>
                    <a href="tel:+919876543210" className="emergency-btn">
                      <FontAwesomeIcon icon={faPhone} /> +91 62076 27817
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
                        <FontAwesomeIcon icon={activeFaq === index ? faChevronUp : faChevronDown} />
                      </div>
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  ))}
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
              <a href="tel:+91 62076 27817" className="btn">
                <FontAwesomeIcon icon={faPhone} /> Call Now
              </a>
              <a href="mailto:info@servx24.com" className="btn btn-secondary">
                <FontAwesomeIcon icon={faEnvelope} /> Email Us
              </a>
              <a href="#" className="btn btn-outline">
                <FontAwesomeIcon icon={faComments} /> Live Chat
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} scrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default ContactUs;
