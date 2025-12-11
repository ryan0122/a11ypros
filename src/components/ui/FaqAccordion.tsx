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
    <div className="faq-accordion">
      <h2>{title}</h2>
      {faqs.map((faq, index) => (
        <details key={index} className="group border-b border-gray-300 p-4">
          <summary>
            {faq.question}
          </summary>
          <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
        </details>
      ))}
    </div>
  );
};

export default FAQAccordion;
