// import { apiGet } from '../utils/api'; // Not needed since using mock data

export const fetchLandingPageData = async (city) => {
  console.log(`Fetching landing page data for city: ${city}`);
  
  // Using mock data since API endpoints are not available
  console.log('Using mock data for landing page (API endpoint not available)');
  
  return {
      cities: [
        { id: 1, name: 'Mumbai', state: 'Maharashtra' },
        { id: 2, name: 'Delhi', state: 'NCR' },
        { id: 3, name: 'Bangalore', state: 'Karnataka' },
        { id: 4, name: 'Chennai', state: 'Tamil Nadu' },
        { id: 5, name: 'Pune', state: 'Maharashtra' }
      ],
      filter: {
        distance: [
          { id: 1, name: 'Within 5km', value: 5 },
          { id: 2, name: 'Within 10km', value: 10 },
          { id: 3, name: 'Within 15km', value: 15 }
        ],
        ratings: [
          { id: 1, name: '4+ stars', value: 4 },
          { id: 2, name: '3+ stars', value: 3 }
        ],
        services: [
          { id: 1, name: 'General Service', value: 'general' },
          { id: 2, name: 'Oil Change', value: 'oil_change' },
          { id: 3, name: 'Brake Service', value: 'brake_service' },
          { id: 4, name: 'Tire Service', value: 'tire_service' }
        ],
        sort: [
          { id: 1, name: 'Distance', value: 'distance' },
          { id: 2, name: 'Rating', value: 'rating' },
          { id: 3, name: 'Name', value: 'name' }
        ]
      },
      banners: [
        {
          id: 1,
          title: "FIND NEARBY GARAGES",
          subtitle: "Discover verified garages near you for all vehicle types - 2 wheelers, 4 wheelers, and 6 wheelers. Get transparent pricing and real-time service updates.",
          image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
          link: "/garages"
        },
        {
          id: 2,
          title: "TRANSPARENT SERVICE COSTS",
          subtitle: "Compare service prices across multiple garages. Get detailed cost breakdowns for general service, oil change, brake service, and more for all vehicle types.",
          image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg",
          link: "/services"
        },
        {
          id: 3,
          title: "ALL VEHICLE TYPES SUPPORTED",
          subtitle: "From bikes and scooters to cars, trucks, and commercial vehicles. Find specialized garages for your specific vehicle type with verified mechanics.",
          image: "https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg",
          link: "/about"
        },
        {
          id: 4,
          title: "EXPERT MECHANICS AVAILABLE",
          subtitle: "Connect with certified and experienced mechanics who specialize in your vehicle type. Get professional service with quality assurance and warranty.",
          image: "https://images.pexels.com/photos/9607057/pexels-photo-9607057.jpeg",
          link: "/mechanics"
        }
      ]
    };
};
