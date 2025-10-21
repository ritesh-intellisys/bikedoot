import React from "react";

function AboutUs() {
  const isMobile = window.innerWidth <= 570;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 px-4 py-0 mt-9 sm:mt-10 md:mt-18">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-3 md:gap-4">
          <div className="max-w-2xl">
            <h1 className="text-blue-600 font-bold text-xl sm:text-2xl md:text-3xl mb-4">
              Find & Compare Local Mechanics
            </h1>
            <p className="text-lg sm:text-xl md:text-xl mb-4">
              Looking for a reliable bike service or repair nearby? ServX24 makes it easy to find trusted mechanics in your area—saving you time, money, and effort.
            </p>
            <p className="text-gray-600 text-lg sm:text-xl md:text-xl mb-4">
              As the only online platform dedicated to bike servicing, ServX24 offers a simple and easy-to-use experience, providing all the information you need to make the right choice.
            </p>
          </div>
          <div>
            <img
              src="/assets/images/aboutUs/image 109.png"
              alt="ServX24_logo"
              className="w-50 sm:w-55 md:w-64 h-auto cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 p-4">
        <div className="max-w-2xl flex flex-col items-center justify-center">
          <h2 className="text-blue-600 font-bold text-xl sm:text-2xl md:text-3xl mb-4">
            Top Quality Services at the Best Prices
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl md:text-2xl">
            Powered by Our Trusted Partners
          </p>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="mr-0 sm:mr-2 md:mr-4 mt-0 sm:mt-0">
            <img
              src="/assets/images/aboutUs/image.png"
              alt="Inspection Service"
              className="max-h-50 w-auto cursor-pointer"
            />
            <p>Inspection Service</p>
            <p>₹99</p>
          </div>
          <div className="mr-0 sm:mr-2 md:mr-4">
            <img
              src="/assets/images/aboutUs/image(1).png"
              alt="General Service"
              className="max-h-50 w-auto cursor-pointer"
            />
            <p>General Service</p>
            <p>₹149</p>
          </div>
          <div>
            <img
              src="/assets/images/aboutUs/image(2).png"
              alt="Combo Service"
              className="max-h-50 w-auto cursor-pointer"
            />
            <p>Combo Service</p>
            <p>₹799</p>
          </div>
        </div>
      </div>

      <div className={`flex flex-col items-center justify-center gap-1 sm:gap-4 p-4 ${isMobile ? 'mt-0' : ''}`}>
        <div className="max-w-2xl flex flex-col items-center justify-center">
          <h2 className="text-blue-600 font-bold text-xl sm:text-2xl md:text-3xl mb-4">
            Why Choose ServX24?
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl md:text-2xl text-center">
            We connect you with verified mechanics and provide transparent pricing
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
