export const getGaragesByServiceCategory = async (requestData) => {
  console.log('Fetching garages with request data:', requestData);
  
  const vehicleType = requestData.vehicleType || 'two-wheeler';
  
  // Try real API first - same as old website
  if (vehicleType === 'two-wheeler') {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://workshop.bikedoot.com/api';
      
      // Create API request data matching old website structure exactly
      const location = requestData.location?.trim() || sessionStorage.getItem("selectedCity") || 'Pune'; // Ensure location is not empty
      const apiRequestData = {
        location: location,
        latitude: parseFloat(requestData.latitude),
        longitude: parseFloat(requestData.longitude),
        filter: {
          sort: requestData.filter?.sort || [],
          ratings: requestData.filter?.ratings || [],
          distence: requestData.filter?.distance || [], // Keep old spelling like old website
          services: requestData.filter?.services || [],
          brands: requestData.filter?.brands || [],
        }
      };
      
      // Validate required fields before making the request
      if (!apiRequestData.location || !apiRequestData.latitude || !apiRequestData.longitude) {
        throw new Error(`Missing required fields: location=${apiRequestData.location}, latitude=${apiRequestData.latitude}, longitude=${apiRequestData.longitude}`);
      }
      
      console.log('🔄 Original requestData:', requestData);
      console.log('🔄 Processed location:', location);
      console.log('🔄 Attempting real API call to /listgarage/ with data:', apiRequestData);
      console.log('🔄 API URL:', `${API_URL}/listgarage/`);
      console.log('🔄 Request body:', JSON.stringify(apiRequestData));
      
      const response = await fetch(`${API_URL}/listgarage/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Bikedoot-WebApp/1.0',
        },
        body: JSON.stringify(apiRequestData),
      });
      
      console.log('🔄 Response status:', response.status);
      console.log('🔄 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        // Try to get error details from response
        let errorDetails = '';
        try {
          const errorText = await response.text();
          console.log('🔄 Error response body:', errorText);
          errorDetails = ` - ${errorText}`;
        } catch (e) {
          console.log('🔄 Could not read error response body');
        }
        throw new Error(`HTTP error! status: ${response.status}${errorDetails}`);
      }
      
      const result = await response.json();
      console.log('✅ Real API response:', result);
      return result;
    } catch (error) {
      console.warn('❌ API call failed for two-wheelers, using mock data:', error.message);
    }
  } else {
    console.log(`Using mock data for ${vehicleType} (API only available for two-wheelers)`);
  }
  
  const garageType = requestData.garageType || 'all';
  const selectedBrand = requestData.selectedBrand || '';
  const filterBrands = requestData.filter?.brands || [];
  
  // Mock data for different vehicle types
  const mockData = {
    'two-wheeler': [
        {
          id: 1,
          name: "Premium Bike Care",
          location: "Mumbai, Maharashtra",
          address: "123 Main Street, Andheri West",
          rating: 4.8,
          reviewCount: 156,
          verified: true,
          distance: 2.3,
          image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
          phone: "+91 98765 43210",
          description: "Premium bike service center with certified mechanics and quality parts.",
          brands: ['Honda', 'Yamaha', 'Bajaj'],
          banners: [
            { image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg" },
            { image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg" },
            { image: "https://images.pexels.com/photos/1384572336/pexels-photo-1384572336.jpeg" }
          ],
          services: {
            service: [
              {
                "110cc": [
                  { name: "General Service", price: "₹500" },
                  { name: "Oil Change", price: "₹300" },
                  { name: "Brake Service", price: "₹400" }
                ]
              },
              {
                "150cc": [
                  { name: "General Service", price: "₹600" },
                  { name: "Oil Change", price: "₹350" },
                  { name: "Brake Service", price: "₹450" }
                ]
              }
            ],
            addon: [
              {
                "110cc": [
                  { name: "Engine Cleaning", price: "₹200" },
                  { name: "Chain Lubrication", price: "₹150" }
                ]
              }
            ]
          },
          reviews: [
            {
              name: "Rajesh Kumar",
              rating: 5,
              comment: "Excellent service! My bike runs like new after their service.",
              date: "2 days ago"
            },
            {
              name: "Priya Sharma",
              rating: 4,
              comment: "Good quality work and reasonable prices. Recommended!",
              date: "1 week ago"
            },
            {
              name: "Amit Singh",
              rating: 5,
              comment: "Professional staff and quick service. Will definitely come back.",
              date: "2 weeks ago"
            }
          ],
          operatingHours: "8:00 AM - 8:00 PM"
        },
        {
          id: 2,
          name: "Speed Motors",
          location: "Delhi, NCR",
          address: "456 Park Street, Connaught Place",
          rating: 4.6,
          reviewCount: 89,
          verified: true,
          distance: 4.1,
          image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg",
          phone: "+91 98765 43211",
          description: "Fast and reliable bike service with experienced technicians.",
          brands: ['TVS', 'Hero', 'Royal Enfield'],
          banners: [
            { image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg" },
            { image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg" }
          ],
          services: {
            service: [
              {
                "110cc": [
                  { name: "General Service", price: "₹450" },
                  { name: "Oil Change", price: "₹250" },
                  { name: "Tire Service", price: "₹350" }
                ]
              }
            ],
            addon: [
              {
                "110cc": [
                  { name: "Battery Check", price: "₹100" },
                  { name: "Air Filter Cleaning", price: "₹80" }
                ]
              }
            ]
          },
          reviews: [
            {
              name: "Vikram Patel",
              rating: 4,
              comment: "Quick service and good quality work.",
              date: "3 days ago"
            },
            {
              name: "Sunita Reddy",
              rating: 5,
              comment: "Very satisfied with the service. Staff is friendly and professional.",
              date: "1 week ago"
            }
          ],
          operatingHours: "9:00 AM - 7:00 PM"
        },
        {
          id: 3,
          name: "Bike Masters",
          location: "Bangalore, Karnataka",
          address: "789 Tech Street, Koramangala",
          rating: 4.9,
          reviewCount: 234,
          verified: true,
          distance: 1.8,
          image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
          phone: "+91 98765 43212",
          description: "Expert bike service with premium quality and customer satisfaction guarantee.",
          brands: ['KTM', 'Suzuki', 'Kawasaki'],
          banners: [
            { image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg" },
            { image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg" }
          ],
          services: {
            service: [
              {
                "150cc": [
                  { name: "General Service", price: "₹600" },
                  { name: "Oil Change", price: "₹350" },
                  { name: "Brake Service", price: "₹450" },
                  { name: "Tire Service", price: "₹400" }
                ]
              },
              {
                "200cc": [
                  { name: "General Service", price: "₹700" },
                  { name: "Oil Change", price: "₹400" },
                  { name: "Brake Service", price: "₹550" }
                ]
              }
            ],
            addon: [
              {
                "150cc": [
                  { name: "Performance Tuning", price: "₹500" },
                  { name: "Custom Paint", price: "₹2000" }
                ]
              }
            ]
          },
          reviews: [
            {
              name: "Arjun Nair",
              rating: 5,
              comment: "Best bike service in Bangalore! Highly recommended.",
              date: "1 day ago"
            },
            {
              name: "Deepika Menon",
              rating: 5,
              comment: "Excellent service quality and customer care.",
              date: "4 days ago"
            },
            {
              name: "Rohit Kumar",
              rating: 4,
              comment: "Good service but a bit expensive. Quality is top-notch.",
              date: "1 week ago"
            }
          ],
          operatingHours: "7:00 AM - 9:00 PM"
        },
        {
          id: 4,
          name: "City Bike Service",
          location: "Chennai, Tamil Nadu",
          address: "321 Beach Road, Marina",
          rating: 4.7,
          reviewCount: 67,
          verified: false,
          distance: 6.2,
          image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg",
          phone: "+91 98765 43213",
          description: "Affordable bike service with good quality work.",
          brands: ['Hero', 'TVS'],
          banners: [
            { image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg" }
          ],
          services: {
            service: [
              {
                "110cc": [
                  { name: "General Service", price: "₹400" },
                  { name: "Oil Change", price: "₹200" }
                ]
              }
            ],
            addon: [
              {
                "110cc": [
                  { name: "Basic Cleaning", price: "₹100" }
                ]
              }
            ]
          },
          reviews: [
            {
              name: "Suresh Kumar",
              rating: 4,
              comment: "Good service at reasonable prices.",
              date: "5 days ago"
            },
            {
              name: "Lakshmi Devi",
              rating: 5,
              comment: "Very satisfied with the work done on my bike.",
              date: "1 week ago"
            }
          ],
          operatingHours: "8:30 AM - 6:30 PM"
        },
        {
          id: 5,
          name: "Royal Bike Care",
          location: "Pune, Maharashtra",
          address: "654 Hill Street, Koregaon Park",
          rating: 4.5,
          reviewCount: 123,
          verified: true,
          distance: 3.7,
          image: "https://media.istockphoto.com/id/1384572336/photo/motorbike-mechanic-busy-repairing-bike-at-garage-with-medical-face-mask-concept-of-safety.jpg?s=1024x1024&w=is&k=20&c=OiYa7Nxy3s4AUoG9NGr8sHM5fYNuq4-4oI6HFF-MJ7U=",
          phone: "+91 98765 43214",
          description: "Royal treatment for your bike with premium service quality.",
          brands: ['Royal Enfield', 'Ducati', 'BMW'],
          banners: [
            { image: "https://media.istockphoto.com/id/1384572336/photo/motorbike-mechanic-busy-repairing-bike-at-garage-with-medical-face-mask-concept-of-safety.jpg?s=1024x1024&w=is&k=20&c=OiYa7Nxy3s4AUoG9NGr8sHM5fYNuq4-4oI6HFF-MJ7U=" },
            { image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg" }
          ],
          services: {
            service: [
              {
                "350cc": [
                  { name: "General Service", price: "₹550" },
                  { name: "Oil Change", price: "₹280" },
                  { name: "Brake Service", price: "₹380" },
                  { name: "Tire Service", price: "₹320" }
                ]
              },
              {
                "500cc": [
                  { name: "General Service", price: "₹650" },
                  { name: "Oil Change", price: "₹350" },
                  { name: "Brake Service", price: "₹450" }
                ]
              }
            ],
            addon: [
              {
                "350cc": [
                  { name: "Premium Cleaning", price: "₹300" },
                  { name: "Engine Polish", price: "₹400" }
                ]
              }
            ]
          },
          reviews: [
            {
              name: "Ravi Joshi",
              rating: 5,
              comment: "Excellent service for my Royal Enfield. Highly recommended!",
              date: "3 days ago"
            },
            {
              name: "Anita Desai",
              rating: 4,
              comment: "Good quality work and professional staff.",
              date: "1 week ago"
            },
            {
              name: "Vikram Thakur",
              rating: 5,
              comment: "Best garage in Pune for premium bikes.",
              date: "2 weeks ago"
            }
          ],
          operatingHours: "8:00 AM - 8:00 PM"
        },
        {
          id: 6,
          name: "Express Bike Service",
          location: "Hyderabad, Telangana",
          address: "987 Tech Park, Hitech City",
          rating: 4.4,
          reviewCount: 78,
          verified: false,
          distance: 5.5,
          image: "https://media.istockphoto.com/id/2083542249/photo/mechanic-repairing-a-motorcycle-at-a-garage.jpg?s=1024x1024&w=is&k=20&c=a5YRRsexkf3V1nSDX2I3dNl_tSzCVeEw3hrhL61yxj0=",
          services: [
            { id: 1, name: "General Service", price: "₹350" },
            { id: 2, name: "Oil Change", price: "₹180" },
            { id: 3, name: "Quick Service", price: "₹250" }
          ],
          operatingHours: "9:00 AM - 7:00 PM",
          phone: "+91 98765 43215",
          description: "Fast and efficient bike service for busy professionals."
        }
    ],
    'three-wheeler': [
      {
        id: 1,
        name: "Auto Rickshaw Experts",
        location: "Mumbai, Maharashtra",
        address: "123 Auto Street, Andheri West",
        rating: 4.7,
        reviewCount: 89,
        verified: true,
        distance: 2.1,
        image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
        services: [
          { id: 1, name: "Engine Service", price: "₹800" },
          { id: 2, name: "Brake Service", price: "₹600" },
          { id: 3, name: "Transmission Service", price: "₹700" }
        ],
        operatingHours: "8:00 AM - 8:00 PM",
        phone: "+91 98765 43220",
        description: "Specialized three-wheeler service center with expert mechanics."
      },
      {
        id: 2,
        name: "Three Wheeler Hub",
        location: "Delhi, NCR",
        address: "456 Transport Street, Connaught Place",
        rating: 4.5,
        reviewCount: 67,
        verified: true,
        distance: 3.8,
        image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg",
        services: [
          { id: 1, name: "General Service", price: "₹750" },
          { id: 2, name: "Oil Change", price: "₹400" },
          { id: 3, name: "Tire Service", price: "₹500" }
        ],
        operatingHours: "9:00 AM - 7:00 PM",
        phone: "+91 98765 43221",
        description: "Complete three-wheeler maintenance and repair services."
      },
      {
        id: 3,
        name: "Auto Care Center",
        location: "Bangalore, Karnataka",
        address: "789 Auto Street, Koramangala",
        rating: 4.6,
        reviewCount: 112,
        verified: true,
        distance: 2.5,
        image: "https://images.unsplash.com/photo-1599256630445-67b5772b1204?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        services: [
          { id: 1, name: "Engine Service", price: "₹850" },
          { id: 2, name: "Brake Service", price: "₹650" },
          { id: 3, name: "Transmission Service", price: "₹750" },
          { id: 4, name: "Tire Service", price: "₹550" }
        ],
        operatingHours: "7:00 AM - 9:00 PM",
        phone: "+91 98765 43222",
        description: "Professional three-wheeler service with quality parts and skilled mechanics."
      },
      {
        id: 4,
        name: "City Auto Service",
        location: "Chennai, Tamil Nadu",
        address: "321 Auto Road, Marina",
        rating: 4.4,
        reviewCount: 45,
        verified: false,
        distance: 4.2,
        image: "https://plus.unsplash.com/premium_photo-1661411119301-8cae0adce9a7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        services: [
          { id: 1, name: "General Service", price: "₹700" },
          { id: 2, name: "Oil Change", price: "₹350" }
        ],
        operatingHours: "8:30 AM - 6:30 PM",
        phone: "+91 98765 43223",
        description: "Affordable three-wheeler service with reliable workmanship."
      },
      {
        id: 5,
        name: "Royal Auto Care",
        location: "Pune, Maharashtra",
        address: "654 Auto Street, Koregaon Park",
        rating: 4.8,
        reviewCount: 98,
        verified: true,
        distance: 1.9,
        image: "https://media.istockphoto.com/id/1384572336/photo/motorbike-mechanic-busy-repairing-bike-at-garage-with-medical-face-mask-concept-of-safety.jpg?s=1024x1024&w=is&k=20&c=OiYa7Nxy3s4AUoG9NGr8sHM5fYNuq4-4oI6HFF-MJ7U=",
        services: [
          { id: 1, name: "Engine Service", price: "₹900" },
          { id: 2, name: "Brake Service", price: "₹700" },
          { id: 3, name: "Transmission Service", price: "₹800" },
          { id: 4, name: "Tire Service", price: "₹600" }
        ],
        operatingHours: "8:00 AM - 8:00 PM",
        phone: "+91 98765 43224",
        description: "Premium three-wheeler service with royal treatment and quality guarantee."
      },
      {
        id: 6,
        name: "Express Auto Service",
        location: "Hyderabad, Telangana",
        address: "987 Auto Park, Hitech City",
        rating: 4.3,
        reviewCount: 56,
        verified: false,
        distance: 3.5,
        image: "https://media.istockphoto.com/id/2083542249/photo/mechanic-repairing-a-motorcycle-at-a-garage.jpg?s=1024x1024&w=is&k=20&c=a5YRRsexkf3V1nSDX2I3dNl_tSzCVeEw3hrhL61yxj0=",
        services: [
          { id: 1, name: "General Service", price: "₹650" },
          { id: 2, name: "Oil Change", price: "₹300" },
          { id: 3, name: "Quick Service", price: "₹450" }
        ],
        operatingHours: "9:00 AM - 7:00 PM",
        phone: "+91 98765 43225",
        description: "Fast and efficient three-wheeler service for busy auto drivers."
      }
    ],
    'four-wheeler': [
      {
        id: 1,
        name: "Car Care Center",
        location: "Mumbai, Maharashtra",
        address: "123 Car Street, Andheri West",
        rating: 4.9,
        reviewCount: 234,
        verified: true,
        distance: 1.8,
        image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
        services: [
          { id: 1, name: "General Service", price: "₹1500" },
          { id: 2, name: "Oil Change", price: "₹800" },
          { id: 3, name: "Brake Service", price: "₹1200" },
          { id: 4, name: "AC Service", price: "₹1000" }
        ],
        operatingHours: "8:00 AM - 8:00 PM",
        phone: "+91 98765 43230",
        description: "Premium car service center with state-of-the-art equipment."
      },
      {
        id: 2,
        name: "Auto Masters",
        location: "Delhi, NCR",
        address: "456 Vehicle Street, Connaught Place",
        rating: 4.6,
        reviewCount: 156,
        verified: true,
        distance: 2.5,
        image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg",
        services: [
          { id: 1, name: "General Service", price: "₹1200" },
          { id: 2, name: "Oil Change", price: "₹600" },
          { id: 3, name: "Tire Service", price: "₹800" }
        ],
        operatingHours: "9:00 AM - 7:00 PM",
        phone: "+91 98765 43231",
        description: "Expert car service with quality parts and skilled technicians."
      },
      {
        id: 3,
        name: "Car Experts Hub",
        location: "Bangalore, Karnataka",
        address: "789 Car Street, Koramangala",
        rating: 4.8,
        reviewCount: 189,
        verified: true,
        distance: 2.1,
        image: "https://images.unsplash.com/photo-1599256630445-67b5772b1204?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        services: [
          { id: 1, name: "General Service", price: "₹1400" },
          { id: 2, name: "Oil Change", price: "₹750" },
          { id: 3, name: "Brake Service", price: "₹1100" },
          { id: 4, name: "AC Service", price: "₹950" },
          { id: 5, name: "Tire Service", price: "₹900" }
        ],
        operatingHours: "7:00 AM - 9:00 PM",
        phone: "+91 98765 43232",
        description: "Professional car service with advanced diagnostic equipment and expert mechanics."
      },
      {
        id: 4,
        name: "City Car Service",
        location: "Chennai, Tamil Nadu",
        address: "321 Car Road, Marina",
        rating: 4.5,
        reviewCount: 78,
        verified: false,
        distance: 3.8,
        image: "https://plus.unsplash.com/premium_photo-1661411119301-8cae0adce9a7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        services: [
          { id: 1, name: "General Service", price: "₹1000" },
          { id: 2, name: "Oil Change", price: "₹500" },
          { id: 3, name: "AC Service", price: "₹800" }
        ],
        operatingHours: "8:30 AM - 6:30 PM",
        phone: "+91 98765 43233",
        description: "Affordable car service with reliable workmanship and quality parts."
      },
      {
        id: 5,
        name: "Royal Car Care",
        location: "Pune, Maharashtra",
        address: "654 Car Street, Koregaon Park",
        rating: 4.7,
        reviewCount: 145,
        verified: true,
        distance: 2.3,
        image: "https://media.istockphoto.com/id/1384572336/photo/motorbike-mechanic-busy-repairing-bike-at-garage-with-medical-face-mask-concept-of-safety.jpg?s=1024x1024&w=is&k=20&c=OiYa7Nxy3s4AUoG9NGr8sHM5fYNuq4-4oI6HFF-MJ7U=",
        services: [
          { id: 1, name: "General Service", price: "₹1600" },
          { id: 2, name: "Oil Change", price: "₹850" },
          { id: 3, name: "Brake Service", price: "₹1300" },
          { id: 4, name: "AC Service", price: "₹1100" },
          { id: 5, name: "Tire Service", price: "₹1000" }
        ],
        operatingHours: "8:00 AM - 8:00 PM",
        phone: "+91 98765 43234",
        description: "Royal treatment for your car with premium service quality and luxury amenities."
      },
      {
        id: 6,
        name: "Express Car Service",
        location: "Hyderabad, Telangana",
        address: "987 Car Park, Hitech City",
        rating: 4.4,
        reviewCount: 92,
        verified: false,
        distance: 4.1,
        image: "https://media.istockphoto.com/id/2083542249/photo/mechanic-repairing-a-motorcycle-at-a-garage.jpg?s=1024x1024&w=is&k=20&c=a5YRRsexkf3V1nSDX2I3dNl_tSzCVeEw3hrhL61yxj0=",
        services: [
          { id: 1, name: "General Service", price: "₹1100" },
          { id: 2, name: "Oil Change", price: "₹550" },
          { id: 3, name: "Quick Service", price: "₹800" }
        ],
        operatingHours: "9:00 AM - 7:00 PM",
        phone: "+91 98765 43235",
        description: "Fast and efficient car service for busy professionals with quick turnaround."
      }
    ],
    'six-wheeler': [
      {
        id: 1,
        name: "Commercial Vehicle Hub",
        location: "Mumbai, Maharashtra",
        address: "123 Truck Street, Andheri West",
        rating: 4.8,
        reviewCount: 145,
        verified: true,
        distance: 3.2,
        image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
        services: [
          { id: 1, name: "Engine Overhaul", price: "₹5000" },
          { id: 2, name: "Transmission Service", price: "₹3000" },
          { id: 3, name: "Brake Service", price: "₹2500" },
          { id: 4, name: "Suspension Service", price: "₹2000" }
        ],
        operatingHours: "7:00 AM - 9:00 PM",
        phone: "+91 98765 43240",
        description: "Specialized commercial vehicle service center for trucks and heavy vehicles."
      },
      {
        id: 2,
        name: "Heavy Vehicle Care",
        location: "Delhi, NCR",
        address: "456 Transport Hub, Connaught Place",
        rating: 4.7,
        reviewCount: 98,
        verified: true,
        distance: 4.5,
        image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg",
        services: [
          { id: 1, name: "General Service", price: "₹4000" },
          { id: 2, name: "Oil Change", price: "₹1500" },
          { id: 3, name: "Tire Service", price: "₹2000" }
        ],
        operatingHours: "8:00 AM - 8:00 PM",
        phone: "+91 98765 43241",
        description: "Complete maintenance and repair services for commercial vehicles."
      },
      {
        id: 3,
        name: "Truck Masters",
        location: "Bangalore, Karnataka",
        address: "789 Truck Street, Koramangala",
        rating: 4.9,
        reviewCount: 167,
        verified: true,
        distance: 2.8,
        image: "https://images.unsplash.com/photo-1599256630445-67b5772b1204?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        services: [
          { id: 1, name: "Engine Overhaul", price: "₹5500" },
          { id: 2, name: "Transmission Service", price: "₹3200" },
          { id: 3, name: "Brake Service", price: "₹2700" },
          { id: 4, name: "Suspension Service", price: "₹2200" },
          { id: 5, name: "Tire Service", price: "₹2500" }
        ],
        operatingHours: "6:00 AM - 10:00 PM",
        phone: "+91 98765 43242",
        description: "Expert commercial vehicle service with heavy-duty equipment and skilled technicians."
      },
      {
        id: 4,
        name: "City Truck Service",
        location: "Chennai, Tamil Nadu",
        address: "321 Truck Road, Marina",
        rating: 4.5,
        reviewCount: 89,
        verified: false,
        distance: 5.1,
        image: "https://plus.unsplash.com/premium_photo-1661411119301-8cae0adce9a7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        services: [
          { id: 1, name: "General Service", price: "₹3500" },
          { id: 2, name: "Oil Change", price: "₹1200" },
          { id: 3, name: "Brake Service", price: "₹2000" }
        ],
        operatingHours: "8:30 AM - 6:30 PM",
        phone: "+91 98765 43243",
        description: "Affordable commercial vehicle service with reliable workmanship and quality parts."
      },
      {
        id: 5,
        name: "Royal Truck Care",
        location: "Pune, Maharashtra",
        address: "654 Truck Street, Koregaon Park",
        rating: 4.6,
        reviewCount: 123,
        verified: true,
        distance: 3.7,
        image: "https://media.istockphoto.com/id/1384572336/photo/motorbike-mechanic-busy-repairing-bike-at-garage-with-medical-face-mask-concept-of-safety.jpg?s=1024x1024&w=is&k=20&c=OiYa7Nxy3s4AUoG9NGr8sHM5fYNuq4-4oI6HFF-MJ7U=",
        services: [
          { id: 1, name: "Engine Overhaul", price: "₹4800" },
          { id: 2, name: "Transmission Service", price: "₹2800" },
          { id: 3, name: "Brake Service", price: "₹2300" },
          { id: 4, name: "Suspension Service", price: "₹1900" },
          { id: 5, name: "Tire Service", price: "₹2100" }
        ],
        operatingHours: "7:00 AM - 9:00 PM",
        phone: "+91 98765 43244",
        description: "Premium commercial vehicle service with royal treatment and quality guarantee."
      },
      {
        id: 6,
        name: "Express Truck Service",
        location: "Hyderabad, Telangana",
        address: "987 Truck Park, Hitech City",
        rating: 4.4,
        reviewCount: 76,
        verified: false,
        distance: 4.8,
        image: "https://media.istockphoto.com/id/2083542249/photo/mechanic-repairing-a-motorcycle-at-a-garage.jpg?s=1024x1024&w=is&k=20&c=a5YRRsexkf3V1nSDX2I3dNl_tSzCVeEw3hrhL61yxj0=",
        services: [
          { id: 1, name: "General Service", price: "₹3800" },
          { id: 2, name: "Oil Change", price: "₹1300" },
          { id: 3, name: "Quick Service", price: "₹2500" }
        ],
        operatingHours: "8:00 AM - 8:00 PM",
        phone: "+91 98765 43245",
        description: "Fast and efficient commercial vehicle service for busy fleet operators."
      }
    ]
  };

  // Authorized service center mock data
  const authorizedServiceCenters = {
    'two-wheeler': {
      'Honda': [
        {
          id: 101,
          name: "Honda Authorized Service Center",
          location: "Mumbai, Maharashtra",
          address: "Honda Plaza, Andheri West",
          rating: 4.9,
          reviewCount: 234,
          verified: true,
          distance: 1.8,
          image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
          services: [
            { id: 1, name: "Honda Genuine Service", price: "₹800" },
            { id: 2, name: "Honda Oil Change", price: "₹450" },
            { id: 3, name: "Honda Brake Service", price: "₹600" }
          ],
          operatingHours: "8:00 AM - 8:00 PM",
          phone: "+91 98765 44001",
          description: "Official Honda service center with genuine parts and certified technicians."
        },
        {
          id: 102,
          name: "Honda Service Hub",
          location: "Delhi, NCR",
          address: "Honda Center, Connaught Place",
          rating: 4.7,
          reviewCount: 189,
          verified: true,
          distance: 3.2,
          image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg",
          services: [
            { id: 1, name: "Honda Genuine Service", price: "₹750" },
            { id: 2, name: "Honda Oil Change", price: "₹400" },
            { id: 3, name: "Honda Tire Service", price: "₹550" }
          ],
          operatingHours: "9:00 AM - 7:00 PM",
          phone: "+91 98765 44002",
          description: "Authorized Honda service with warranty coverage and genuine parts."
        }
      ],
      'Yamaha': [
        {
          id: 201,
          name: "Yamaha Authorized Service",
          location: "Bangalore, Karnataka",
          address: "Yamaha Service Center, MG Road",
          rating: 4.8,
          reviewCount: 167,
          verified: true,
          distance: 2.5,
          image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
          services: [
            { id: 1, name: "Yamaha Genuine Service", price: "₹850" },
            { id: 2, name: "Yamaha Oil Change", price: "₹500" },
            { id: 3, name: "Yamaha Performance Tuning", price: "₹1200" }
          ],
          operatingHours: "8:00 AM - 8:00 PM",
          phone: "+91 98765 44003",
          description: "Official Yamaha service center with performance tuning expertise."
        }
      ],
      'Bajaj': [
        {
          id: 301,
          name: "Bajaj Authorized Service",
          location: "Pune, Maharashtra",
          address: "Bajaj Service Center, Koregaon Park",
          rating: 4.6,
          reviewCount: 145,
          verified: true,
          distance: 1.9,
          image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg",
          services: [
            { id: 1, name: "Bajaj Genuine Service", price: "₹700" },
            { id: 2, name: "Bajaj Oil Change", price: "₹350" },
            { id: 3, name: "Bajaj Engine Service", price: "₹900" }
          ],
          operatingHours: "8:00 AM - 8:00 PM",
          phone: "+91 98765 44004",
          description: "Authorized Bajaj service with genuine parts and warranty."
        }
      ]
    },
    'three-wheeler': {
      'Bajaj': [
        {
          id: 401,
          name: "Bajaj Auto Authorized Service",
          location: "Mumbai, Maharashtra",
          address: "Bajaj Service Center, Andheri",
          rating: 4.7,
          reviewCount: 123,
          verified: true,
          distance: 2.1,
          image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
          services: [
            { id: 1, name: "Bajaj Auto Service", price: "₹600" },
            { id: 2, name: "Engine Overhaul", price: "₹1200" },
            { id: 3, name: "Transmission Service", price: "₹800" }
          ],
          operatingHours: "8:00 AM - 8:00 PM",
          phone: "+91 98765 44005",
          description: "Authorized Bajaj Auto service center for three-wheelers."
        }
      ],
      'TVS': [
        {
          id: 501,
          name: "TVS Authorized Service",
          location: "Chennai, Tamil Nadu",
          address: "TVS Service Center, Anna Nagar",
          rating: 4.5,
          reviewCount: 98,
          verified: true,
          distance: 1.7,
          image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg",
          services: [
            { id: 1, name: "TVS Genuine Service", price: "₹550" },
            { id: 2, name: "TVS Oil Change", price: "₹300" },
            { id: 3, name: "TVS Brake Service", price: "₹450" }
          ],
          operatingHours: "9:00 AM - 7:00 PM",
          phone: "+91 98765 44006",
          description: "Official TVS service center for three-wheelers."
        }
      ]
    },
    'four-wheeler': {
      'Maruti Suzuki': [
        {
          id: 601,
          name: "Maruti Suzuki Arena",
          location: "Delhi, NCR",
          address: "Maruti Arena, Connaught Place",
          rating: 4.8,
          reviewCount: 312,
          verified: true,
          distance: 2.3,
          image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
          services: [
            { id: 1, name: "Maruti Genuine Service", price: "₹1200" },
            { id: 2, name: "Maruti Oil Change", price: "₹800" },
            { id: 3, name: "Maruti Brake Service", price: "₹1500" }
          ],
          operatingHours: "8:00 AM - 8:00 PM",
          phone: "+91 98765 44007",
          description: "Authorized Maruti Suzuki service center with genuine parts."
        }
      ],
      'Hyundai': [
        {
          id: 701,
          name: "Hyundai Service Center",
          location: "Bangalore, Karnataka",
          address: "Hyundai Center, MG Road",
          rating: 4.6,
          reviewCount: 245,
          verified: true,
          distance: 1.9,
          image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg",
          services: [
            { id: 1, name: "Hyundai Genuine Service", price: "₹1400" },
            { id: 2, name: "Hyundai Oil Change", price: "₹900" },
            { id: 3, name: "Hyundai AC Service", price: "₹1800" }
          ],
          operatingHours: "8:00 AM - 8:00 PM",
          phone: "+91 98765 44008",
          description: "Official Hyundai service center with warranty coverage."
        }
      ]
    },
    'six-wheeler': {
      'Tata': [
        {
          id: 801,
          name: "Tata Motors Service Center",
          location: "Mumbai, Maharashtra",
          address: "Tata Service Hub, BKC",
          rating: 4.7,
          reviewCount: 189,
          verified: true,
          distance: 3.2,
          image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
          services: [
            { id: 1, name: "Tata Genuine Service", price: "₹2500" },
            { id: 2, name: "Tata Oil Change", price: "₹1500" },
            { id: 3, name: "Tata Engine Service", price: "₹3500" }
          ],
          operatingHours: "8:00 AM - 8:00 PM",
          phone: "+91 98765 44009",
          description: "Authorized Tata Motors service center for commercial vehicles."
        }
      ],
      'Ashok Leyland': [
        {
          id: 901,
          name: "Ashok Leyland Service Center",
          location: "Chennai, Tamil Nadu",
          address: "Ashok Leyland Hub, Guindy",
          rating: 4.5,
          reviewCount: 156,
          verified: true,
          distance: 2.8,
          image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg",
          services: [
            { id: 1, name: "Ashok Leyland Service", price: "₹2800" },
            { id: 2, name: "Transmission Overhaul", price: "₹4500" },
            { id: 3, name: "Brake System Service", price: "₹2200" }
          ],
          operatingHours: "8:00 AM - 8:00 PM",
          phone: "+91 98765 44010",
          description: "Official Ashok Leyland service center for heavy vehicles."
        }
      ]
    }
  };

  // Filter data based on garage type and brand
  let filteredData = [];
  
  // If brands are selected from FilterSystem, automatically switch to authorized mode
  if (filterBrands.length > 0) {
    console.log('Brand filtering activated for brands:', filterBrands);
    console.log('Vehicle type:', vehicleType);
    console.log('Available authorized brands:', Object.keys(authorizedServiceCenters[vehicleType] || {}));
    
    // Search only in authorized service centers for selected brands
    const allAuthorized = [];
    filterBrands.forEach(brand => {
      const brandCenters = authorizedServiceCenters[vehicleType]?.[brand] || [];
      console.log(`Brand: ${brand}, Found centers:`, brandCenters.length);
      allAuthorized.push(...brandCenters);
    });
    filteredData = allAuthorized;
    console.log('Total filtered data:', filteredData.length);
  } else if (garageType === 'authorized' && selectedBrand) {
    // Return authorized service centers for specific brand (from garage component dropdown)
    filteredData = authorizedServiceCenters[vehicleType]?.[selectedBrand] || [];
  } else if (garageType === 'authorized' && !selectedBrand) {
    // Return all authorized service centers for the vehicle type
    const allAuthorized = [];
    Object.values(authorizedServiceCenters[vehicleType] || {}).forEach(brandCenters => {
      allAuthorized.push(...brandCenters);
    });
    filteredData = allAuthorized;
  } else {
    // Return all garages (local + authorized)
    filteredData = mockData[vehicleType] || [];
  }

  // Check if no results found and provide appropriate message
  let message = null;
  if (filteredData.length === 0) {
    if (filterBrands.length > 0) {
      message = `No garages found for the selected brands: ${filterBrands.join(', ')}. More authorized garages coming soon!`;
    } else if (garageType === 'authorized' && selectedBrand) {
      message = `No authorized service centers found for ${selectedBrand}. More authorized garages coming soon!`;
    } else {
      message = "No garages found matching your criteria. More garages coming soon!";
    }
  }
  
  return {
    data: filteredData,
    message: message
  };
};