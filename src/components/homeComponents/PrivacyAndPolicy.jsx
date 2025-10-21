import React from 'react';

function PrivacyAndPolicy() {
  return (
    <div className="max-w-6xl mx-auto mt-9 sm:mt-10 md:mt-18">
      <div className="mb-8 px-2 sm:px-4 md:px-6">
        {/* Title */}
        <h1 className="text-blue-600 font-bold text-xl sm:text-2xl md:text-3xl mb-1">
          Privacy & Policy
          <hr className="border-gray-300" />
        </h1>

        {/* Section Content */}
        <p className="mb-4">
          Welcome to ServX24. Your privacy is important to us. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our website and services.
        </p>

        <p className="mb-2">
          By using our website or services, you agree to the practices described in this Privacy Policy.
        </p>
        <p className="mb-4">
          We collect the following types of information:
        </p>

        <h2 className="text-lg sm:text-xl font-bold mt-4 mb-2">
          1. Information We Collect
        </h2>

        <h3 className="font-bold mt-4 mb-2">
          a) Personal Information
        </h3>
        <p className="mb-2">
          When you use our services, we may collect:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Your name</li>
          <li>Phone number</li>
          <li>Email address</li>
          <li>Address and pickup location</li>
          <li>Payment details (processed via secure third-party gateways)</li>
        </ul>

        <h3 className="font-bold mt-4 mb-2">
          b) Usage Data
        </h3>
        <p className="mb-2">
          We may collect data on how you use our website, such as:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Pages visited</li>
          <li>Time spent on pages</li>
          <li>Clicks and actions</li>
          <li>IP address and device information</li>
        </ul>
        <p className="mb-4">
          We use tools like Google Analytics and Microsoft Clarity for this purpose.
        </p>

        <h2 className="text-lg sm:text-xl font-bold mt-6 mb-2">
          2. How We Use Your Information
        </h2>
        <p className="mb-4">
          We use the collected information to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide and maintain our services</li>
          <li>Process your bookings and payments</li>
          <li>Send you service updates and notifications</li>
          <li>Improve our website and services</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-lg sm:text-xl font-bold mt-6 mb-2">
          3. Information Sharing
        </h2>
        <p className="mb-4">
          We do not sell, trade, or otherwise transfer your personal information to third parties except:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>With your explicit consent</li>
          <li>To service providers who assist us in operating our website</li>
          <li>To comply with legal requirements</li>
          <li>To protect our rights and safety</li>
        </ul>

        <h2 className="text-lg sm:text-xl font-bold mt-6 mb-2">
          4. Data Security
        </h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2 className="text-lg sm:text-xl font-bold mt-6 mb-2">
          5. Your Rights
        </h2>
        <p className="mb-4">
          You have the right to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Opt-out of marketing communications</li>
          <li>Lodge a complaint with supervisory authorities</li>
        </ul>

        <h2 className="text-lg sm:text-xl font-bold mt-6 mb-2">
          6. Contact Us
        </h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <div className="pl-4">
          <p><strong>Email:</strong> privacy@servx24.com</p>
          <p><strong>Phone:</strong> +91 6207627817</p>
          <p><strong>Address:</strong> Plot No. 21, Knowledge Park-III, Greater Noida, Uttar Pradesh 201306, India</p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyAndPolicy;
