import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const isMobile = window.innerWidth <= 599;
  const isBelow482 = window.innerWidth <= 482;

  return (
    <div className="bg-gradient-to-r from-red-100 via-red-600 to-red-800 text-black px-4 sm:px-5 md:px-5 py-4 sm:py-4 md:py-5 w-full box-border text-center">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-between items-center gap-1 sm:gap-1 md:gap-4 text-center max-w-7xl mx-auto`}>
        {/* Left Section - Logo Centered */}
        <div className="max-w-xs sm:max-w-xs md:max-w-lg text-center">
          <img
            src="/Bikedoot.png"
            alt="ServX24_logo"
            className={`h-14 sm:h-12 md:h-20 w-auto cursor-pointer block mx-auto ${isMobile ? 'ml-0' : 'sm:ml-0 md:ml-3'}`}
          />
        </div>

        {/* Right Section - Links */}
        <div className={`mt-0 flex flex-wrap justify-center text-left max-w-xs sm:max-w-sm md:max-w-xs`}>
          {[
            { label: "Terms & Conditions", to: "/termsandconditions" },
            { label: "Privacy & Policy", to: "/privacyandpolicy" },
            { label: "Mechanic Register" },
            { label: "About Us", to: "/aboutus" },
            { label: "Help & Support", to: "/helpandsupport" },
            { label: "Contact Us", to: "/contactus" },
          ].map((item, index) => (
            <div
              key={index}
              className={`${
                isBelow482
                  ? "w-1/2" // 2 per row for <482px
                  : "w-1/3 sm:w-1/3 md:w-1/2" // 3 per row for default xs, 2 for md
              } px-1 sm:px-0 md:px-2 py-1 sm:py-1 md:py-2`}
            >
              <Link
                to={item.to || "#"}
                className="text-white no-underline block text-xs sm:text-xs md:text-base hover:text-gray-200 transition-colors"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Width Divider */}
      <div className="w-full mt-0 sm:mt-0 md:mt-5">
        <hr className="border-white border-opacity-50" />
      </div>

      {/* Copyright Text */}
          <p className="mt-2 text-white text-sm">
        Copyright &copy; 2025 ServX24 | info@servx24.com
      </p>
      <p className="text-white text-sm mt-1">
        Call us:{" "}
        <a
          href="tel:+916207627817"
          className="text-white underline hover:text-gray-200"
        >
          +91 62076 27817
        </a>
      </p>
    </div>
  );
}

export default Footer;
