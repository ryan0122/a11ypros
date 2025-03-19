import React from "react";

interface FAQ {
  question: string;
  answer: string;
}

type FAQProps = {
  faqs: FAQ[];
  title: string;
};

const FAQAccordion: React.FC<FAQProps> = ({ faqs, title }) => {
  return (
    <div className="max-w-4xl mx-auto mt-10 mb-20">
      <h2 className="text-center text-3xl">{title}</h2>
      {faqs.map((faq, index) => (
        <details key={index} className="border-b border-gray-300 p-4">
          <summary className="text-lg font-semibold cursor-pointer list-none">
            {faq.question}
          </summary>
          <div className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: faq.answer }} />
        </details>
      ))}
    </div>
  );
};

export default FAQAccordion;
