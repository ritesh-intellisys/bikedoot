// Comprehensive list of Indian cities with FontAwesome icons and metadata
export const indianCities = [
  // Major Metropolitan Cities (Featured)
  {
    id: 1,
    name: 'Mumbai',
    state: 'Maharashtra',
    icon: 'faCity',
    category: 'Metropolitan',
    featured: true,
    coordinates: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: 2,
    name: 'Delhi',
    state: 'NCR',
    icon: 'faBuilding',
    category: 'Metropolitan',
    featured: true,
    coordinates: { lat: 28.7041, lng: 77.1025 }
  },
  {
    id: 3,
    name: 'Bangalore',
    state: 'Karnataka',
    icon: 'faIndustry',
    category: 'Metropolitan',
    featured: true,
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: 4,
    name: 'Chennai',
    state: 'Tamil Nadu',
    icon: 'faUniversity',
    category: 'Metropolitan',
    featured: true,
    coordinates: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: 5,
    name: 'Kolkata',
    state: 'West Bengal',
    icon: 'faTheaterMasks',
    category: 'Metropolitan',
    featured: true,
    coordinates: { lat: 22.5726, lng: 88.3639 }
  },
  {
    id: 6,
    name: 'Hyderabad',
    state: 'Telangana',
    icon: 'faGem',
    category: 'Metropolitan',
    featured: true,
    coordinates: { lat: 17.3850, lng: 78.4867 }
  },
  {
    id: 7,
    name: 'Pune',
    state: 'Maharashtra',
    icon: 'faGraduationCap',
    category: 'Metropolitan',
    featured: true,
    coordinates: { lat: 18.5204, lng: 73.8567 }
  },
  {
    id: 8,
    name: 'Ahmedabad',
    state: 'Gujarat',
    icon: 'faIndustry',
    category: 'Metropolitan',
    featured: true,
    coordinates: { lat: 23.0225, lng: 72.5714 }
  },

  // State Capitals and Major Cities
  {
    id: 9,
    name: 'Jaipur',
    state: 'Rajasthan',
    icon: 'faCrown',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 26.9124, lng: 75.7873 }
  },
  {
    id: 10,
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    icon: 'faHeart',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 26.8467, lng: 80.9462 }
  },
  {
    id: 11,
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    icon: 'faBuilding',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 23.2599, lng: 77.4126 }
  },
  {
    id: 12,
    name: 'Chandigarh',
    state: 'Chandigarh',
    icon: 'faTree',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 30.7333, lng: 76.7794 }
  },
  {
    id: 13,
    name: 'Dehradun',
    state: 'Uttarakhand',
    icon: 'faMountain',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 30.3165, lng: 78.0322 }
  },
  {
    id: 14,
    name: 'Shimla',
    state: 'Himachal Pradesh',
    icon: 'faMountain',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 31.1048, lng: 77.1734 }
  },
  {
    id: 15,
    name: 'Srinagar',
    state: 'Jammu & Kashmir',
    icon: 'faShip',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 34.0837, lng: 74.7973 }
  },
  {
    id: 16,
    name: 'Patna',
    state: 'Bihar',
    icon: 'faCross',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 25.5941, lng: 85.1376 }
  },
  {
    id: 17,
    name: 'Ranchi',
    state: 'Jharkhand',
    icon: 'faTree',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 23.3441, lng: 85.3096 }
  },
  {
    id: 18,
    name: 'Bhubaneswar',
    state: 'Odisha',
    icon: 'faBuilding',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 20.2961, lng: 85.8245 }
  },
  {
    id: 19,
    name: 'Raipur',
    state: 'Chhattisgarh',
    icon: 'faTree',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 21.2514, lng: 81.6296 }
  },
  {
    id: 20,
    name: 'Gandhinagar',
    state: 'Gujarat',
    icon: 'faBuilding',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 23.2156, lng: 72.6369 }
  },
  {
    id: 21,
    name: 'Panaji',
    state: 'Goa',
    icon: 'faWater',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 15.4909, lng: 73.8278 }
  },
  {
    id: 22,
    name: 'Thiruvananthapuram',
    state: 'Kerala',
    icon: 'faTree',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 8.5241, lng: 76.9366 }
  },
  {
    id: 23,
    name: 'Bengaluru',
    state: 'Karnataka',
    icon: 'faTree',
    category: 'Metropolitan',
    featured: false,
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },

  // Other Major Cities
  {
    id: 24,
    name: 'Surat',
    state: 'Gujarat',
    icon: 'faGem',
    category: 'Industrial',
    featured: false,
    coordinates: { lat: 21.1702, lng: 72.8311 }
  },
  {
    id: 25,
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    icon: 'faIndustry',
    category: 'Industrial',
    featured: false,
    coordinates: { lat: 26.4499, lng: 80.3319 }
  },
  {
    id: 26,
    name: 'Nagpur',
    state: 'Maharashtra',
    icon: 'faTree',
    category: 'Industrial',
    featured: false,
    coordinates: { lat: 21.1458, lng: 79.0882 }
  },
  {
    id: 27,
    name: 'Indore',
    state: 'Madhya Pradesh',
    icon: 'faBuilding',
    category: 'Commercial',
    featured: false,
    coordinates: { lat: 22.7196, lng: 75.8577 }
  },
  {
    id: 28,
    name: 'Vadodara',
    state: 'Gujarat',
    icon: 'faPalette',
    category: 'Cultural',
    featured: false,
    coordinates: { lat: 22.3072, lng: 73.1812 }
  },
  {
    id: 29,
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    icon: 'faCross',
    category: 'Spiritual',
    featured: false,
    coordinates: { lat: 25.3176, lng: 82.9739 }
  },
  {
    id: 30,
    name: 'Amritsar',
    state: 'Punjab',
    icon: 'faHeart',
    category: 'Spiritual',
    featured: false,
    coordinates: { lat: 31.6340, lng: 74.8723 }
  },
  {
    id: 31,
    name: 'Agra',
    state: 'Uttar Pradesh',
    icon: 'faBuilding',
    category: 'Heritage',
    featured: false,
    coordinates: { lat: 27.1767, lng: 78.0081 }
  },
  {
    id: 32,
    name: 'Jodhpur',
    state: 'Rajasthan',
    icon: 'faCrown',
    category: 'Heritage',
    featured: false,
    coordinates: { lat: 26.2389, lng: 73.0243 }
  },
  {
    id: 33,
    name: 'Udaipur',
    state: 'Rajasthan',
    icon: 'faCrown',
    category: 'Heritage',
    featured: false,
    coordinates: { lat: 24.5854, lng: 73.7125 }
  },
  {
    id: 34,
    name: 'Kochi',
    state: 'Kerala',
    icon: 'faWater',
    category: 'Port',
    featured: false,
    coordinates: { lat: 9.9312, lng: 76.2673 }
  },
  {
    id: 35,
    name: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    icon: 'faWater',
    category: 'Port',
    featured: false,
    coordinates: { lat: 17.6868, lng: 83.2185 }
  },
  {
    id: 36,
    name: 'Mysore',
    state: 'Karnataka',
    icon: 'faCrown',
    category: 'Heritage',
    featured: false,
    coordinates: { lat: 12.2958, lng: 76.6394 }
  },
  {
    id: 37,
    name: 'Guwahati',
    state: 'Assam',
    icon: 'faTree',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 26.1445, lng: 91.7362 }
  },
  {
    id: 38,
    name: 'Imphal',
    state: 'Manipur',
    icon: 'faTree',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 24.8170, lng: 93.9368 }
  },
  {
    id: 39,
    name: 'Aizawl',
    state: 'Mizoram',
    icon: 'faTree',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 23.7307, lng: 92.7173 }
  },
  {
    id: 40,
    name: 'Kohima',
    state: 'Nagaland',
    icon: 'faTree',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 25.6751, lng: 94.1086 }
  },
  {
    id: 41,
    name: 'Shillong',
    state: 'Meghalaya',
    icon: 'faTree',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 25.5788, lng: 91.8933 }
  },
  {
    id: 42,
    name: 'Itanagar',
    state: 'Arunachal Pradesh',
    icon: 'faTree',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 27.0844, lng: 93.6053 }
  },
  {
    id: 43,
    name: 'Gangtok',
    state: 'Sikkim',
    icon: 'faMountain',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 27.3389, lng: 88.6065 }
  },
  {
    id: 44,
    name: 'Agartala',
    state: 'Tripura',
    icon: 'faTree',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 23.8315, lng: 91.2868 }
  },
  {
    id: 45,
    name: 'Port Blair',
    state: 'Andaman & Nicobar',
    icon: 'faWater',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 11.6234, lng: 92.7265 }
  },
  {
    id: 46,
    name: 'Kavaratti',
    state: 'Lakshadweep',
    icon: 'faWater',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 10.5593, lng: 72.6358 }
  },
  {
    id: 47,
    name: 'Silvassa',
    state: 'Dadra & Nagar Haveli',
    icon: 'faIndustry',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 20.2762, lng: 72.9707 }
  },
  {
    id: 48,
    name: 'Daman',
    state: 'Daman & Diu',
    icon: 'faWater',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 20.3974, lng: 72.8328 }
  },
  {
    id: 49,
    name: 'Puducherry',
    state: 'Puducherry',
    icon: 'faWater',
    category: 'Capital',
    featured: false,
    coordinates: { lat: 11.9416, lng: 79.8083 }
  }
];

// Get featured cities (major metropolitan cities)
export const getFeaturedCities = () => {
  return indianCities.filter(city => city.featured);
};

// Get cities by category
export const getCitiesByCategory = (category) => {
  return indianCities.filter(city => city.category === category);
};

// Search cities by name or state
export const searchCities = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return indianCities.filter(city => 
    city.name.toLowerCase().includes(lowercaseQuery) ||
    city.state.toLowerCase().includes(lowercaseQuery)
  );
};

// Get cities grouped by state
export const getCitiesByState = () => {
  const grouped = {};
  indianCities.forEach(city => {
    if (!grouped[city.state]) {
      grouped[city.state] = [];
    }
    grouped[city.state].push(city);
  });
  return grouped;
};
