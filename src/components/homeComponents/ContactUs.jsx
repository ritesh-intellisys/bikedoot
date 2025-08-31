import React from "react";

export default function ContactUs() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-center gap-1 sm:gap-2 md:gap-1 py-1 sm:py-2 md:py-6 mt-15 md:mt-25">
        {/* Left Side - Info */}
        <div className="flex-1 text-center md:text-left p-3 md:p-5 lg:p-7 shadow-lg rounded-lg bg-gray-100 w-full min-w-md md:min-w-lg min-h-md md:min-h-lg">
          <div className="flex justify-center md:justify-start mb-5">
            {/* Add any icon or logo here */}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
            Contact Information
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mt-2 sm:mt-3 mb-2 sm:mb-3 text-center">
            Feel free to reach out to us for bike service bookings, inquiries, or emergency roadside assistance.
            We're here to keep your ride smooth, safe, and hassle-free.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="flex justify-center items-center w-full">
          <div className="flex-1 px-4 py-1 sm:py-2 md:py-2 w-full max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Heading */}
              <div className="col-span-1 sm:col-span-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
                  Have A Question?
                </h2>
                <hr className="border-gray-300 my-2" />
              </div>

              <div className="col-span-1 sm:col-span-1">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="col-span-1 sm:col-span-1">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="col-span-1 sm:col-span-1">
                <input
                  type="text"
                  placeholder="What service do you want?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="col-span-1 sm:col-span-1">
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="col-span-1 sm:col-span-2 flex justify-center">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
