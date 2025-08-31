import React, { useState, useEffect, useRef } from "react";

const faqs = [
  { id: 1, question: "What services do you offer?", answer: "We provide bike servicing, repairs, roadside assistance, puncture fixing, engine diagnostics, battery jumpstart, towing, and more." },
  { id: 2, question: "How can I book a service?", answer: "You can book a service through our website or mobile app by selecting the required service and scheduling an appointment." },
  { id: 3, question: "Do you offer emergency roadside assistance?", answer: "Yes, we provide 24/7 roadside assistance for emergencies, including towing, battery jumpstarts, and minor repairs." },
  { id: 4, question: "What payment methods do you accept?", answer: "We accept credit cards, debit cards, UPI, and digital wallets for secure transactions." },
  { id: 5, question: "Do you provide warranty on services?", answer: "Yes, we offer a warranty on selected services. Please check with our support team for details." },
  { id: 6, question: "How long does a service take?", answer: "Service times vary, but most basic services take 30-60 minutes." },
  { id: 7, question: "Can I cancel my booking?", answer: "Yes, cancellations are allowed up to 24 hours before the service time." },
  { id: 8, question: "Do you provide home service?", answer: "Yes, we offer home service for selected areas." }
];

export default function HelpAndSupport() {
  const isMobile = window.innerWidth <= 570;
  const [selectedBox, setSelectedBox] = useState(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (containerRef.current) {
        const containerHeight = window.innerHeight * 0.8;
        const boxHeight = 80;
        setVisibleCount(Math.floor(containerHeight / boxHeight));
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const toggleExpand = (id) => {
    setSelectedBox((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 md:mt-25" ref={containerRef}>
      <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 md:gap-1 py-1 sm:py-2 md:py-2">
        <h1 className="text-3xl sm:text-4xl font-bold mb-0">
          FAQS
        </h1>
        <div className="flex flex-col w-full mt-0 sm:mt-0">
          {faqs.slice(0, visibleCount).map((faq, index) => (
            <div key={faq.id}>
              <div className="w-full flex flex-col p-2 text-left">
                <div className="flex items-center justify-between">
                  <p className={`font-bold ${selectedBox === faq.id ? 'text-blue-600' : 'text-black'}`}>
                    {faq.question}
                  </p>
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {selectedBox === faq.id ? '−' : '+'}
                  </button>
                </div>
                {selectedBox === faq.id && (
                  <p className="text-gray-600 mt-1">{faq.answer}</p>
                )}
              </div>
              {index < visibleCount - 1 && index < faqs.length - 1 && (
                <hr className="border-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="flex-1 px-4 py-1 sm:py-2 md:py-2 w-full max-w-6xl mt-0 sm:mt-0 md:mt-0 mb-1 sm:mb-1 md:mb-1">
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
  );
}
