// src/pages/component/FAQ.jsx
import React, { useState } from 'react';

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: "What is the return policy?",
      answer: "You can return any unopened item within 7 days for a full refund."
    },
    {
      question: "How do I track my order?",
      answer: "You can track your order using the tracking link provided in your confirmation email."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept only cash on delivery"
    },
    {
      question: "Can I change my order?",
      answer: "Once your order is placed, you can contact our support team to make changes before it is shipped."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to many countries around the world. Please check our shipping page for details."
    }
  ];

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div>
    <div className="p-5 text-center bg-[#E3DCD7]">
    <div className=' font-bold text-3xl valky text-gray-500'>Frequently Asked Questions</div>
    </div>
      <div className="space-y-4 pt-10 px-10 pb-10 container mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded shadow">
            <div
              className="p-4 cursor-pointer bg-gray-200 flex justify-between hover:text-[#AB3430] hover:bg-red-50"

              onClick={() => toggleFAQ(index)}
            >
              <h2 className="text-lg font-semibold ">{faq.question}</h2>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hover:text-[#AB3430]">
  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg>

            </div>
            {expandedIndex === index && (
              <div className="p-4 bg-white">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
