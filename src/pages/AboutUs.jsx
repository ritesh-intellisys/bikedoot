import React, { useState, useEffect, useRef } from 'react';
import './AboutUs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBicycle,
  faUsers,
  faMapMarkerAlt,
  faCalendarAlt,
  faTools,
  faSearch,
  faCog,
  faStar,
  faCheck,
  faLeaf,
  faLightbulb,
  faHandshake,
  faMedal,
  faPhone,
  faEnvelope,
  faClock,
  faTimes,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { 
  faTwitter, 
  faFacebook, 
  faInstagram, 
  faLinkedin,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';

const AboutUs = ({ setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const statsSectionRef = useRef(null);
  const teamSectionRef = useRef(null);
  const valuesSectionRef = useRef(null);
  const servicesSectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Check if stats section is in view for counter animation
      if (statsSectionRef.current) {
        const rect = statsSectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          animateCounters();
        }
      }

      // Check if services section is in view
      if (servicesSectionRef.current) {
        const rect = servicesSectionRef.current.getBoundingClientRect();
        const serviceCards = document.querySelectorAll('.service-card');
        if (rect.top < window.innerHeight * 0.8) {
          serviceCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate');
            }, index * 150);
          });
        }
      }

      // Check if team section is in view
      if (teamSectionRef.current) {
        const rect = teamSectionRef.current.getBoundingClientRect();
        const teamMembers = document.querySelectorAll('.team-member');
        if (rect.top < window.innerHeight * 0.8) {
          teamMembers.forEach((member, index) => {
            setTimeout(() => {
              member.classList.add('animate');
            }, index * 100);
          });
        }
      }

      // Check if values section is in view
      if (valuesSectionRef.current) {
        const rect = valuesSectionRef.current.getBoundingClientRect();
        const valueCards = document.querySelectorAll('.value-card');
        if (rect.top < window.innerHeight * 0.8) {
          valueCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate');
            }, index * 150);
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check on page load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const increment = target / 100;
      
      const updateCounter = () => {
        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count);
          setTimeout(updateCounter, 20);
        } else {
          counter.innerText = target;
        }
      };
      
      updateCounter();
    });
  };

  const stats = [
    { number: '12000', label: 'Happy Customers', icon: faUsers },
    { number: '50', label: 'Cities Served', icon: faMapMarkerAlt },
    { number: '8', label: 'Years Experience', icon: faCalendarAlt },
    { number: '24', label: 'Support Services', icon: faTools }
  ];

  const services = [
    {
      name: "Inspection Service",
      price: "₹99",
      description: "Comprehensive bike inspection to identify issues and maintenance needs",
      icon: faSearch,
      image: "https://images.unsplash.com/photo-1570129476815-ba368ac77013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
      features: ["Full diagnostic check", "Safety assessment", "Performance evaluation", "Detailed report"]
    },
    {
      name: "General Service",
      price: "₹149",
      description: "Basic maintenance service to keep your bike in optimal condition",
      icon: faCog,
      image: "https://plus.unsplash.com/premium_photo-1661779071501-629999b46de0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
      features: ["Chain lubrication", "Brake adjustment", "Tire pressure check", "Gear tuning"]
    },
    {
      name: "Combo Service",
      price: "₹799",
      description: "Complete premium service package for thorough bike maintenance",
      icon: faStar,
      image: "https://plus.unsplash.com/premium_photo-1661750362435-00f8fef16292?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
      features: ["Full cleaning", "Component replacement", "Advanced tuning", "1 month warranty"]
    }
  ];

  const teamMembers = [
    { 
      name: 'Alex Johnson', 
      role: 'Founder & CEO', 
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      bio: 'Former professional cyclist with a passion for sustainable transportation.',
      social: { twitter: '#', instagram: '#', linkedin: '#' }
    },
    { 
      name: 'Sarah Williams', 
      role: 'Head of Design', 
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      bio: 'Industrial designer focused on creating ergonomic and stylish bikes.',
      social: { twitter: '#', instagram: '#', linkedin: '#' }
    },
    { 
      name: 'Michael Chen', 
      role: 'Lead Engineer', 
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      bio: 'Mechanical engineer with 15 years experience in bicycle design.',
      social: { twitter: '#', instagram: '#', linkedin: '#' }
    },
    { 
      name: 'Emily Rodriguez', 
      role: 'Community Manager', 
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      bio: 'Organizer of cycling events and community outreach programs.',
      social: { twitter: '#', instagram: '#', linkedin: '#' }
    }
  ];

  const values = [
    {
      title: "Sustainability",
      description: "We're committed to eco-friendly practices and promoting cycling as a sustainable transportation solution.",
      icon: faLeaf,
      color: "#4CAF50"
    },
    {
      title: "Innovation",
      description: "We continuously push boundaries to develop better products and services for the cycling community.",
      icon: faLightbulb,
      color: "#2196F3"
    },
    {
      title: "Community",
      description: "We believe in building strong, inclusive cycling communities that support and inspire each other.",
      icon: faHandshake,
      color: "#FF9800"
    },
    {
      title: "Quality",
      description: "We never compromise on quality, ensuring that every product meets our high standards of excellence.",
      icon: faMedal,
      color: "#E91E63"
    }
  ];

  return (
    <div className="bikedoot-about">

      {/* Header */}
      <header className={isScrolled ? 'scrolled' : ''}>
        <div className="container header-container">
          <a href="#" className="logo" onClick={() => setCurrentPage('home')}>
            <FontAwesomeIcon icon={faBicycle} />
            Bike<span>Doot</span>
          </a>
          
          <div className="menu-toggle" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </div>
          
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#" onClick={() => alert("Bikes Clicked!")}>Bikes</a></li>
            <li><a href="#" onClick={() => alert("Accessories Clicked!")}>Accessories</a></li>
            <li><a href="#" onClick={() => alert("Services Clicked!")}>Services</a></li>
          </ul>

          <div className="header-actions">
            <a href="#" onClick={() => setCurrentPage('home')}>Home</a>
            <a href="#" onClick={() => setCurrentPage('about')}>About</a>
            <a href="#" onClick={() => setCurrentPage('contact')}>Contact</a>
            <a href="#"><FontAwesomeIcon icon={faSearch} /></a>
            <a href="#"><FontAwesomeIcon icon={faBicycle} /></a>
            <a href="#"><FontAwesomeIcon icon={faUsers} /></a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="floating-elements">
          <div className="floating-element">🚴</div>
          <div className="floating-element">⚡</div>
          <div className="floating-element">🔧</div>
          <div className="floating-element">🌙</div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1>Redefining Cycling Culture</h1>
            <p>At BikeDoot, we're passionate about creating exceptional cycling experiences through innovation, quality, and community.</p>
            <div className="hero-buttons">
              <a href="#" className="btn">Explore Our Story</a>
              <a href="#" className="btn btn-secondary">Meet The Team</a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" ref={servicesSectionRef}>
        <div className="container">
          <div className="section-title">
            <h2>Top Quality Services at the Best Prices</h2>
            <p>Powered by Our Trusted Partners</p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-image">
                  <img src={service.image} alt={service.name} />
                  <div className="service-overlay">
                    <div className="service-logo">
                      <FontAwesomeIcon icon={faBicycle} />
                    </div>
                  </div>
                </div>
                <div className="service-content">
                  <h3>{service.name}</h3>
                  <div className="service-price">{service.price}</div>
                  <p>{service.description}</p>
                  <ul className="service-features">
                    {service.features.map((feature, idx) => (
                      <li key={idx}>
                        <FontAwesomeIcon icon={faCheck} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="btn service-btn">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" ref={statsSectionRef}>
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={stat.icon} />
                </div>
                <div className="stat-number" data-target={stat.number}>0</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our <span>Mission</span></h2>
              <p>At BikeDoot, we believe that cycling is more than just a mode of transportation—it's a lifestyle, a community, and a way to connect with the world around us.</p>
              <p>Our mission is to empower cyclists of all levels with high-quality bikes, accessories, and services that enhance their riding experience while fostering a sustainable and inclusive cycling culture.</p>
              <p>Through innovation, education, and community engagement, we strive to make cycling accessible and enjoyable for everyone.</p>
              <a href="#" className="btn">Learn More</a>
            </div>
            <div className="mission-image">
              <img src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80" alt="BikeDoot Mission" />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section" ref={teamSectionRef}>
        <div className="container">
          <div className="section-title">
            <h2>Our Team</h2>
            <p>Meet the passionate individuals behind BikeDoot</p>
          </div>
          
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                  <div className="member-overlay">
                    <div className="social-links">
                      <a href={member.social.twitter}><FontAwesomeIcon icon={faTwitter} /></a>
                      <a href={member.social.instagram}><FontAwesomeIcon icon={faInstagram} /></a>
                      <a href={member.social.linkedin}><FontAwesomeIcon icon={faLinkedin} /></a>
                    </div>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section" ref={valuesSectionRef}>
        <div className="container">
          <div className="section-title">
            <h2>Our Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon" style={{ color: value.color }}>
                  <FontAwesomeIcon icon={value.icon} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join the BikeDoot Revolution</h2>
            <p>Experience the difference of cycling with BikeDoot. Explore our collection, join our community, or become a partner today.</p>
            <div className="hero-buttons">
              <a href="#" className="btn">Shop Now</a>
              <a href="#" className="btn btn-secondary">Contact Us</a>
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
                <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
              </div>
            </div>
            
                         <div className="footer-col">
               <h3>Quick Links</h3>
               <ul className="footer-links">
                 <li><a href="#" onClick={() => setCurrentPage('home')}>Home</a></li>
                 <li><a href="#">Bikes</a></li>
                 <li><a href="#">Accessories</a></li>
                 <li><a href="#">Services</a></li>
                 <li><a href="#">About Us</a></li>
               </ul>
             </div>
            
            <div className="footer-col">
              <h3>Customer Service</h3>
              <ul className="footer-links">
                <li><a href="#">Contact Us</a></li>
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
    </div>
  );
};

export default AboutUs;
