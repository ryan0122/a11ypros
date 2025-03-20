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
    <div className="faq-accordion max-w-4xl mx-auto mt-10 mb-20">
      <h2 className="text-center text-3xl mb-5">{title}</h2>
      {faqs.map((faq, index) => (
        <details key={index} className="group border-b border-gray-300 p-4">
          <summary className="text-lg font-semibold cursor-pointer flex items-center p-2 gap-3 before:content-['▶'] before:transition-transform before:duration-300 group-open:before:rotate-90">
            {faq.question}
          </summary>
          <div className="mt-1 pl-2" dangerouslySetInnerHTML={{ __html: faq.answer }} />
        </details>
      ))}
    </div>
  );
};

export default FAQAccordion;
