export const getGaragesByServiceCategory = async (requestData) => {
  // For development, return mock data directly
  // TODO: Replace with actual API call when backend is ready
  console.log('Fetching garages with request data:', requestData);
  
  return {
      data: [
        {
          id: 1,
          name: "Premium Bike Care",
          location: "Mumbai, Maharashtra",
          address: "123 Main Street, Andheri West",
          rating: 4.8,
          reviewCount: 156,
          verified: true,
          distance: 2.3,
          image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          services: [
            { id: 1, name: "General Service", price: "₹500" },
            { id: 2, name: "Oil Change", price: "₹300" },
            { id: 3, name: "Brake Service", price: "₹400" }
          ],
          operatingHours: "8:00 AM - 8:00 PM",
          phone: "+91 98765 43210",
          description: "Premium bike service center with certified mechanics and quality parts."
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
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          services: [
            { id: 1, name: "General Service", price: "₹450" },
            { id: 2, name: "Oil Change", price: "₹250" },
            { id: 3, name: "Tire Service", price: "₹350" }
          ],
          operatingHours: "9:00 AM - 7:00 PM",
          phone: "+91 98765 43211",
          description: "Fast and reliable bike service with experienced technicians."
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
          image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          services: [
            { id: 1, name: "General Service", price: "₹600" },
            { id: 2, name: "Oil Change", price: "₹350" },
            { id: 3, name: "Brake Service", price: "₹450" },
            { id: 4, name: "Tire Service", price: "₹400" }
          ],
          operatingHours: "7:00 AM - 9:00 PM",
          phone: "+91 98765 43212",
          description: "Expert bike service with premium quality and customer satisfaction guarantee."
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
          image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          services: [
            { id: 1, name: "General Service", price: "₹400" },
            { id: 2, name: "Oil Change", price: "₹200" }
          ],
          operatingHours: "8:30 AM - 6:30 PM",
          phone: "+91 98765 43213",
          description: "Affordable bike service with good quality work."
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
          image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          services: [
            { id: 1, name: "General Service", price: "₹550" },
            { id: 2, name: "Oil Change", price: "₹280" },
            { id: 3, name: "Brake Service", price: "₹380" },
            { id: 4, name: "Tire Service", price: "₹320" }
          ],
          operatingHours: "8:00 AM - 8:00 PM",
          phone: "+91 98765 43214",
          description: "Royal treatment for your bike with premium service quality."
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
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          services: [
            { id: 1, name: "General Service", price: "₹350" },
            { id: 2, name: "Oil Change", price: "₹180" },
            { id: 3, name: "Quick Service", price: "₹250" }
          ],
          operatingHours: "9:00 AM - 7:00 PM",
          phone: "+91 98765 43215",
          description: "Fast and efficient bike service for busy professionals."
        }
      ]
    };
  };
