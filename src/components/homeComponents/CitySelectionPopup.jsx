import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCity, 
  faBuilding, 
  faIndustry, 
  faUniversity, 
  faHospital, 
  faHotel, 
  faPlane, 
  faShip, 
  faMountain, 
  faTree, 
  faSun, 
  faMoon, 
  faStar, 
  faHeart, 
  faGem, 
  faCrown, 
  faAnchor, 
  faLeaf, 
  faFire, 
  faWater, 
  faPalette, 
  faMusic, 
  faTheaterMasks, 
  faGraduationCap, 
  faBriefcase, 
  faStore, 
  faWarehouse, 
  faIndustry as faFactory, 
  faChurch, 
  faMosque, 
  faCross, 
  faCross as faDharmachakra, 
  faStar as faStarOfDavid, 
  faHeart as faPeace, 
  faHandshake, 
  faHandHoldingHeart, 
  faHandHoldingUsd, 
  faHandHoldingWater, 
  faHandHoldingMedical, 
  faTree as faHandHoldingSeedling,
  faMapPin
} from '@fortawesome/free-solid-svg-icons';
import { indianCities, getFeaturedCities, searchCities, getCitiesByState } from '../../data/cities';
import { getCurrentLocation, getCityFromCoordinates, storeLocationData } from '../../utils/geolocation';

const CitySelectionPopup = ({ isOpen, onClose, onCitySelect, selectedCity }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [citiesByState, setCitiesByState] = useState({});
  const [activeTab, setActiveTab] = useState('featured'); // 'featured', 'search', 'all'
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedCity, setDetectedCity] = useState(null);
  const searchInputRef = useRef(null);
  const popupRef = useRef(null);

  const featuredCities = getFeaturedCities();

  // Helper function to get FontAwesome icon component
  const getIconComponent = (iconName) => {
    const iconMap = {
      faCity: faCity,
      faBuilding: faBuilding,
      faIndustry: faIndustry,
      faUniversity: faUniversity,
      faHospital: faHospital,
      faHotel: faHotel,
      faPlane: faPlane,
      faShip: faShip,
      faMountain: faMountain,
      faTree: faTree,
      faSun: faSun,
      faMoon: faMoon,
      faStar: faStar,
      faHeart: faHeart,
      faGem: faGem,
      faCrown: faCrown,
      faAnchor: faAnchor,
      faLeaf: faLeaf,
      faFire: faFire,
      faWater: faWater,
      faSeedling: faTree, // Using faTree as fallback
      faPalette: faPalette,
      faMusic: faMusic,
      faTheaterMasks: faTheaterMasks,
      faGraduationCap: faGraduationCap,
      faBriefcase: faBriefcase,
      faStore: faStore,
      faWarehouse: faWarehouse,
      faFactory: faFactory,
      faChurch: faChurch,
      faMosque: faMosque,
      faTempleHindu: faCross, // Using faCross as fallback
      faCross: faCross,
      faDharmachakra: faDharmachakra,
      faStarOfDavid: faStarOfDavid,
      faPeace: faPeace,
      faHandshake: faHandshake,
      faHandHoldingHeart: faHandHoldingHeart,
      faHandHoldingUsd: faHandHoldingUsd,
      faHandHoldingWater: faHandHoldingWater,
      faHandHoldingMedical: faHandHoldingMedical,
      faHandHoldingSeedling: faHandHoldingSeedling
    };
    return iconMap[iconName] || faCity; // Default to faCity if icon not found
  };

  useEffect(() => {
    if (isOpen) {
      setCitiesByState(getCitiesByState());
      // Focus search input when popup opens
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    } else {
      // Reset state when popup closes
      setSearchQuery('');
      setDetectedCity(null);
      setIsDetectingLocation(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredCities(searchCities(searchQuery));
      setActiveTab('search');
    } else {
      setFilteredCities([]);
      setActiveTab('featured');
    }
  }, [searchQuery]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleCityClick = (city) => {
    onCitySelect(city.name);
    onClose();
    setSearchQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleAutoDetectLocation = async () => {
    setIsDetectingLocation(true);
    setDetectedCity(null);
    
    try {
      // Get current location
      const { latitude, longitude } = await getCurrentLocation();
      
      // Get city from coordinates using simplified approach
      const cityData = await getCityFromCoordinates(latitude, longitude);
      
      // Store location data
      storeLocationData(latitude, longitude, cityData);
      
      // Set detected city
      setDetectedCity(cityData);
      
      console.log('Location detected:', cityData);
      
    } catch (error) {
      console.error('Geolocation failed:', error);
      alert('Unable to detect your location. Please select a city manually.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleUseDetectedCity = () => {
    if (detectedCity) {
      onCitySelect(detectedCity.city);
      onClose();
      setSearchQuery('');
      setDetectedCity(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div 
        ref={popupRef}
        className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                     <div className="flex items-center space-x-3">
             <MapPinIcon className="w-6 h-6" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
             <h2 className="text-xl font-bold text-white">Select Your City</h2>
           </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
          </button>
        </div>

                 {/* Search Bar */}
         <div className="p-6 border-b border-gray-800">
           <div className="flex space-x-3">
             <div className="relative flex-1">
               <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
               <input
                 ref={searchInputRef}
                 type="text"
                 placeholder="Search for your city..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                                   className="w-full pl-12 pr-4 py-4 bg-gray-800 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-lg"
               />
             </div>
             
             {/* Quick Auto Detect Button */}
             <button
               onClick={handleAutoDetectLocation}
               disabled={isDetectingLocation}
                               className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 disabled:bg-gray-600 text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 whitespace-nowrap"
               title="Auto detect your location"
             >
               {isDetectingLocation ? (
                 <>
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                   <span className="hidden sm:inline">Detecting...</span>
                 </>
                               ) : (
                  <>
                    <MapPinIcon className="w-5 h-5" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                    <span className="hidden sm:inline">Auto Detect</span>
                  </>
                )}
             </button>
           </div>
         </div>

                 {/* Content */}
         <div className="flex-1 overflow-y-auto min-h-0">
           {/* Auto Detect Location Section */}
           <div className="p-6 border-b border-gray-800">
                           <div className="bg-gradient-to-r from-red-600/10 to-cyan-500/10 rounded-xl p-4 border border-red-600/20">
               <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                       <MapPinIcon className="w-6 h-6" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                       <div>
                         <h3 className="text-white font-semibold">Auto Detect Your City</h3>
                         <p className="text-gray-400 text-sm">Let us find your location automatically</p>
                       </div>
                     </div>
                 
                 {!detectedCity ? (
                   <button
                     onClick={handleAutoDetectLocation}
                     disabled={isDetectingLocation}
                                               className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                   >
                     {isDetectingLocation ? (
                       <>
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                         <span>Detecting...</span>
                       </>
                     ) : (
                       <>
                         <MapPinIcon className="w-4 h-4" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                         <span>Detect</span>
                       </>
                     )}
                   </button>
                 ) : (
                   <div className="flex items-center space-x-3">
                     <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2">
                       <div className="flex items-center space-x-2">
                         <div className="text-2xl text-green-400">
                           <FontAwesomeIcon icon={faMapPin} />
                         </div>
                         <div className="text-left">
                           <div className="text-white font-semibold text-sm">{detectedCity.city}</div>
                           <div className="text-gray-400 text-xs">{detectedCity.state}</div>
                         </div>
                       </div>
                     </div>
                     <button
                       onClick={handleUseDetectedCity}
                       className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                     >
                       Use This
                     </button>
                   </div>
                 )}
               </div>
             </div>
           </div>

           {/* Featured Cities */}
           {activeTab === 'featured' && (
             <div className="p-6">
               <h3 className="text-lg font-semibold text-white mb-4">Popular Cities</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {featuredCities.map((city) => (
                   <button
                     key={city.id}
                     onClick={() => handleCityClick(city)}
                     className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                       selectedCity === city.name
                         ? 'border-red-600 bg-red-600 bg-opacity-10'
                         : 'border-gray-700 hover:border-red-600 bg-gray-800 hover:bg-gray-700'
                     }`}
                   >
                                           <div className="text-3xl mb-2 text-red-500">
                       <FontAwesomeIcon icon={getIconComponent(city.icon)} />
                     </div>
                     <div className="text-white font-semibold text-sm">{city.name}</div>
                     <div className="text-gray-400 text-xs">{city.state}</div>
                   </button>
                 ))}
               </div>
             </div>
           )}

                     {/* Search Results */}
           {activeTab === 'search' && (
             <div className="p-6">
               <h3 className="text-lg font-semibold text-white mb-4">
                 Search Results ({filteredCities.length})
               </h3>
               
               {/* Auto Detect Option in Search Results */}
               {filteredCities.length === 0 && (
                 <div className="mb-6">
                   <div className="bg-gradient-to-r from-red-600/10 to-cyan-500/10 rounded-xl p-4 border border-red-600/20">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-3">
                         <MapPinIcon className="w-6 h-6" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                         <div>
                           <h3 className="text-white font-semibold">Can't find your city?</h3>
                           <p className="text-gray-400 text-sm">Try auto-detecting your location</p>
                         </div>
                       </div>
                       
                       {!detectedCity ? (
                         <button
                           onClick={handleAutoDetectLocation}
                           disabled={isDetectingLocation}
                           className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                         >
                           {isDetectingLocation ? (
                             <>
                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                               <span>Detecting...</span>
                             </>
                           ) : (
                             <>
                               <MapPinIcon className="w-4 h-4" style={{ background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                               <span>Detect</span>
                             </>
                           )}
                         </button>
                       ) : (
                         <div className="flex items-center space-x-3">
                           <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2">
                             <div className="flex items-center space-x-2">
                               <div className="text-2xl text-green-400">
                                 <FontAwesomeIcon icon={faMapPin} />
                               </div>
                               <div className="text-left">
                                 <div className="text-white font-semibold text-sm">{detectedCity.city}</div>
                                 <div className="text-gray-400 text-xs">{detectedCity.state}</div>
                               </div>
                             </div>
                           </div>
                           <button
                             onClick={handleUseDetectedCity}
                             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                           >
                             Use This
                           </button>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               )}
              {filteredCities.length > 0 ? (
                <div className="space-y-2">
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCityClick(city)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        selectedCity === city.name
                          ? 'border-red-600 bg-red-600 bg-opacity-10'
                          : 'border-gray-700 hover:border-red-600 bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                                             <div className="flex items-center space-x-4">
                                                   <div className="text-2xl text-red-500">
                           <FontAwesomeIcon icon={getIconComponent(city.icon)} />
                         </div>
                        <div className="text-left">
                          <div className="text-white font-semibold">{city.name}</div>
                          <div className="text-gray-400 text-sm">{city.state}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-gray-400">No cities found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}

          {/* All Cities by State */}
          {activeTab === 'all' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">All Cities</h3>
              <div className="space-y-6">
                {Object.entries(citiesByState).map(([state, cities]) => (
                  <div key={state}>
                                         <h4 className="text-red-500 font-semibold mb-3 text-sm uppercase tracking-wide">
                      {state}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {cities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleCityClick(city)}
                          className={`p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${
                            selectedCity === city.name
                              ? 'border-red-500 bg-red-500 bg-opacity-10'
                              : 'border-gray-700 hover:border-red-500 bg-gray-800 hover:bg-gray-700'
                          }`}
                        >
                                                     <div className="flex items-center space-x-3">
                                                           <div className="text-xl text-red-500">
                               <FontAwesomeIcon icon={getIconComponent(city.icon)} />
                             </div>
                            <div className="text-left">
                              <div className="text-white font-medium text-sm">{city.name}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Tabs */}
        <div className="border-t border-gray-800">
          <div className="flex">
                         <button
               onClick={() => setActiveTab('featured')}
               className={`flex-1 py-4 text-center transition-colors duration-200 ${
                 activeTab === 'featured'
                   ? 'border-b-2 border-red-600'
                   : 'text-gray-400 hover:text-white'
               }`}
               style={activeTab === 'featured' ? { background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}}
             >
              Popular
            </button>
                         <button
               onClick={() => setActiveTab('all')}
               className={`flex-1 py-4 text-center transition-colors duration-200 ${
                 activeTab === 'all'
                   ? 'border-b-2 border-red-600'
                   : 'text-gray-400 hover:text-white'
               }`}
               style={activeTab === 'all' ? { background: 'linear-gradient(135deg, #ff3864, #cc1e3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}}
             >
              All Cities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySelectionPopup;
