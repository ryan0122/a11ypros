import React from "react";

interface FAQ {
  question: string;
  /** HTML, from page and post frontmatter. */
  answer: string;
}

type FAQProps = {
  faqs: FAQ[];
  title: string;
};

/** The site-wide FAQ list: one card per question, with a + that turns into × when open. */
const FAQAccordion: React.FC<FAQProps> = ({ faqs, title }) => {
  return (
    <div className="faq-accordion">
      <h2>{title}</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <details key={index} className="group rounded-xl border border-slate-200 bg-white">
            <summary className="cursor-pointer list-none my-0 px-5 py-4 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0E8168] [&::-webkit-details-marker]:hidden">
              <h3 className="m-0 text-base sm:text-lg font-bold text-slate-900 flex justify-between gap-4">
                {faq.question}
                <span aria-hidden="true" className="text-[#0E8168] group-open:rotate-45 transition-transform text-xl leading-none">
                  +
                </span>
              </h3>
            </summary>
            <div className="faq-answer px-5 pt-3 pb-5 text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.answer }} />
          </details>
        ))}
      </div>
    </div>
  );
};

export default FAQAccordion;
