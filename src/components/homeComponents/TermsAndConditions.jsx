import React from "react";
import { Link } from "react-router-dom";

function TermsAndConditions() {
  return (
    <div className="max-w-6xl mx-auto mt-15 md:mt-25">
      <div className="mb-8 px-2 sm:px-4 md:px-6">
        {/* Title */}
        <h1 className="text-blue-600 font-bold text-xl sm:text-2xl md:text-3xl mb-1">
          Terms & Conditions
          <hr className="border-gray-300" />
        </h1>

        {/* Section: Your Agreement */}
        <h2 className="font-bold text-lg sm:text-xl mb-1">
          Your Agreement
        </h2>
        <p className="text-base sm:text-lg mb-4">
          Welcome to Bikedoot, your trusted bike servicing and booking platform.
          By using our app, you agree to the following terms and conditions.
        </p>

        {/* Section: Agreement to Terms */}
        <h3 className="font-semibold mt-4 mb-2">
          1. AGREEMENT TO TERMS
        </h3>
        <p className="text-sm sm:text-base mb-4">
          These Terms of Use constitute a legally binding agreement made between
          you, whether personally or on behalf of an entity ("you") and Bikedoot
          Service Private Limited ("Company," "we," "us," or "our"), concerning
          your access to and use of the{" "}
          <a
            href="https://www.bikedoot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            https://www.bikedoot.com
          </a>{" "}
          website as well as any other media form, media channel, mobile
          website, or mobile application related, linked, or otherwise
          connected thereto (collectively, the "Site").
        </p>

        <p className="text-sm sm:text-base mb-4">
          We are registered in India and have our registered office at C/O
          Shesh Nath Singh, Alakdiha, Dhanbad, Jharkhand 828201. You agree that
          by accessing the Site, you have read, understood, and agreed to be
          bound by all of these Terms of Use. IF YOU DO NOT AGREE WITH ALL OF
          THESE TERMS OF USE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE
          SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
        </p>

        {/* Add more sections as needed */}
        <h3 className="font-semibold mt-6 mb-2">
          2. INTELLECTUAL PROPERTY RIGHTS
        </h3>
        <p className="text-sm sm:text-base mb-4">
          Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
        </p>

        {/* Contact Section */}
        <h3 className="font-semibold mt-6 mb-2">
          27. CONTACT US
        </h3>
        <p className="text-sm sm:text-base mb-4">
          In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
        </p>

        <div className="pl-1 sm:pl-2 text-sm sm:text-base">
          <p className="font-semibold text-base sm:text-lg">Bikedoot Service Private Limited</p>
          <p>Plot No. 21</p>
          <p>Knowledge Park-III</p>
          <p>Greater Noida, Uttar Pradesh 201306</p>
          <p>India</p>
          <p><strong>Phone:</strong> (+91) 6207627817</p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:support@bikedoot.com"
              className="text-blue-600 hover:underline break-words"
            >
              support@bikedoot.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
