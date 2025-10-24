import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/homeComponents/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isAuthenticated } from '../services/authService';
import LoginPopup from '../components/homeComponents/LoginPopup';
import { 
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
  faBars,
  faShieldAlt,
  faEye
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
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const statsSectionRef = useRef(null);

  const handleBookNow = () => {
    if (isAuthenticated()) {
      // User is authenticated, redirect to home to start booking
      console.log("✅ User is authenticated, redirecting to home");
      setCurrentPage('home');
    } else {
      // User not authenticated, show login popup
      console.log("❌ User not authenticated, showing login popup");
      setShowLoginPopup(true);
    }
  };

  const handleLoginSuccess = () => {
    console.log("✅ Login successful, redirecting to home");
    setCurrentPage('home');
  };
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
    { number: '25,000+', label: 'Happy Customers', icon: faUsers },
    { number: '150+', label: 'Cities Served', icon: faMapMarkerAlt },
    { number: '8+', label: 'Years Experience', icon: faCalendarAlt },
    { number: '500+', label: 'Partner Garages', icon: faTools }
  ];

  const services = [
    {
      name: "Inspection Service",
      description: "Comprehensive vehicle inspection to identify issues and maintenance needs",
      icon: faSearch,
      image: "https://images.unsplash.com/photo-1570129476815-ba368ac77013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
      features: ["Full diagnostic check", "Safety assessment", "Performance evaluation", "Detailed report"]
    },
    {
      name: "General Service",
      description: "Basic maintenance service to keep your vehicle in optimal condition",
      icon: faCog,
      image: "https://plus.unsplash.com/premium_photo-1661779071501-629999b46de0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
      features: ["Oil change", "Brake inspection", "Tire pressure check", "Engine tuning"]
    },
    {
      name: "Combo Service",
      description: "Complete premium service package for thorough vehicle maintenance",
      icon: faStar,
      image: "https://plus.unsplash.com/premium_photo-1661750362435-00f8fef16292?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
      features: ["Full cleaning", "Component replacement", "Advanced tuning", "1 month warranty"]
    }
  ];


  const values = [
    {
      title: "Reliability",
      description: "We connect you with verified, trusted garages that deliver consistent, high-quality automotive services.",
      icon: faShieldAlt,
      color: "#4CAF50"
    },
    {
      title: "Transparency",
      description: "Clear pricing, detailed service breakdowns, and honest communication throughout your vehicle service journey.",
      icon: faEye,
      color: "#2196F3"
    },
    {
      title: "Convenience",
      description: "Book services online, track progress in real-time, and get your vehicle serviced at your preferred location.",
      icon: faClock,
      color: "#FF9800"
    },
    {
      title: "Quality",
      description: "We partner only with certified garages that meet our strict standards for service quality and customer satisfaction.",
      icon: faMedal,
      color: "#E91E63"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <Header 
        selectedCity={selectedCity} 
        onCityChange={setSelectedCity} 
        setCurrentPage={setCurrentPage}
        scrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onBackToMain={() => setCurrentPage('home')}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511994298241-608e28f14fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80')`
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-4xl animate-bounce">🚴</div>
          <div className="absolute top-32 right-20 text-3xl animate-pulse">⚡</div>
          <div className="absolute bottom-40 left-20 text-3xl animate-bounce">🔧</div>
          <div className="absolute bottom-20 right-10 text-4xl animate-pulse">🌙</div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              REDEFINING
            </span>
            <br />
            <span className="text-white">VEHICLE CARE</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            At ServX24, we make vehicle ownership simpler with online garages, roadside assistance, trusted servicing, and EV support—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleBookNow}
              className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              EXPLORE OUR SERVICES
            </button>
            <button 
              onClick={() => setCurrentPage('home')}
              className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold py-3 px-8 rounded-lg transition-all duration-200"
            >
              FIND A GARAGE
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-20 px-4 bg-gray-900" ref={servicesSectionRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Top Quality Services at the Best Prices
            </h2>
            <p className="text-gray-400 text-lg">Powered by Our Trusted Partners</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-red-600 p-4 rounded-full">
                      <FontAwesomeIcon icon={faTools} className="text-white text-2xl" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                    <span className="text-2xl font-bold text-red-500">{service.price}</span>
                  </div>
                  <p className="text-gray-300 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={handleBookNow}
                    className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 px-4 bg-black" ref={statsSectionRef}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-red-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FontAwesomeIcon icon={stat.icon} className="text-white text-2xl" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our <span className="text-red-600">Mission</span>
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>At ServX24, we're redefining how people take care of their vehicles with our online garage platform.</p>
                <p>Our mission is to make it easy for users to find the nearest garage, access trusted partner garages, get reliable roadside assistance, and book all types of vehicle servicing, including EV maintenance.</p>
                <p>We also provide a safe and convenient space to buy and sell vehicles—making ServX24 your one-stop solution for smarter, hassle-free vehicle care.</p>
              </div>
              <button 
                onClick={() => setCurrentPage('home')}
                className="mt-6 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Learn More
              </button>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg" 
                alt="ServX24 Mission"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Values Section */}
      <section className="py-16 md:py-20 px-4 bg-gray-900" ref={valuesSectionRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-gray-400 text-lg">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-all duration-300 hover:transform hover:scale-105">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${value.color}20` }}
                >
                  <FontAwesomeIcon 
                    icon={value.icon} 
                    className="text-2xl"
                    style={{ color: value.color }}
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join the ServX24 Revolution
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience the difference of professional automotive service with ServX24. Find trusted garages, book services, or become a partner today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('home')}
              className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Shop Now
            </button>
            <button 
              onClick={() => setCurrentPage('contact')}
              className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold py-3 px-8 rounded-lg transition-all duration-200"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} scrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Login Popup */}
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default AboutUs;
