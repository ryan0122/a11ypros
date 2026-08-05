'use client';

import ContactForm from "@/components/forms/ContactForm";
import ContactPageForm from "@/components/forms/ContactPageForm";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import IconLogo from "@/components/icons/IconLogo";
import { ShieldCheck, CheckCircle2, Clock, Phone, Mail, ArrowRight } from "lucide-react";

const ObfuscatedEmail = () => {
  const email = 'info@a11ypros.com';
  const encoded = btoa(email);

  const handleClick = () => {
    const decoded = atob(encoded) as string;
    window.location.href = `mailto:${decoded}`;
  };

  return (
    <button type="button" onClick={handleClick} className="email-link flex items-center gap-2 text-slate-700 hover:text-[#0E8168] transition-colors">
      <Mail className="w-4 h-4 text-[#0E8168]" /> info@a11ypros.com
    </button>
  );
};

const ObfuscatedFooterEmail = () => {
  const email = 'info@a11ypros.com';
  const encoded = btoa(email);

  const handleClick = () => {
    const decoded = atob(encoded) as string;
    window.location.href = `mailto:${decoded}`;
  };

  return (
    <button type="button" onClick={handleClick} className="email-link text-white hover:text-[#14b895]">
      Email Us
    </button>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const [is404, setIs404] = useState(false);

  useEffect(() => {
    if (document.title.includes("Page Not Found")) {
      setIs404(true);
    } else {
      setIs404(false);
    }
  }, []);

  const doNotDisplay = ["/sitemap", "/free-accessibility-test", "/free-consultation", "/contact-us-thank-you", "/accessibility-statement", "/privacy-policy"].includes(pathname) || is404 || pathname === "";

  const isHomepage = pathname === '/';
  const isContactPage = pathname === '/contact-us';

  return (
    <>
      {!doNotDisplay && (
        <section id="contactForm" className="w-full bg-slate-50 text-slate-900 border-t border-slate-200 relative">
          {isContactPage ? (
            <div className="max-w-4xl mx-auto py-12 px-6">
              <ContactPageForm />
            </div>
          ) : isHomepage ? (
            /* Big Split Contact Form for Homepage Only */
            <div className="py-16 px-6">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Column: Messaging & Value Props */}
                <div className="lg:col-span-5 space-y-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E8168]/10 text-[#0E8168] text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" /> Get In Touch
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                    Ready to Make Your Digital Products Accessible?
                  </h2>

                  <p className="text-slate-600 text-base leading-relaxed">
                    Whether you need a forensic WCAG audit, official VPAT® ACR, website remediation, or ADA litigation defense, our certified team is here to help.
                  </p>

                  <div className="space-y-3 pt-2 text-sm text-slate-700">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#0E8168] shrink-0" />
                      <span>100% Certified Manual Screen Reader Testing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#0E8168] shrink-0" />
                      <span>Proposal response within 1 business day</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#0E8168] shrink-0" />
                      <span>Audit-ready Section 508 & WCAG 2.1/2.2 AA coverage</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-6 text-sm font-medium">
                    <a href="tel:+17207221775" className="flex items-center gap-2 text-slate-700 hover:text-[#0E8168] transition-colors">
                      <Phone className="w-4 h-4 text-[#0E8168]" /> +1 (720) 722-1775
                    </a>
                    {ObfuscatedEmail()}
                  </div>
                </div>

                {/* Right Column: Contact Form Card */}
                <div className="lg:col-span-7 bg-white text-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
                  <ContactForm />
                </div>
              </div>
            </div>
          ) : (
            /* Clean CTA Banner for All Other Pages */
            <div className="max-w-5xl mx-auto py-12 px-6 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E8168]/10 text-[#0E8168] text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4" /> Digital Accessibility Experts
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                Ready to Achieve Full WCAG & ADA Compliance?
              </h2>
              <p className="text-slate-600 text-base max-w-2xl mx-auto mb-6">
                Speak with our team to get expert manual auditing, VPAT® documentation, or website remediation.
              </p>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 bg-[#0E8168] hover:bg-[#0a6b57] text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-base shadow-md"
              >
                Contact Us <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </section>
      )}

      <footer className="bottom-footer w-full gap-4 p-4">
        {/* ROW */}
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center md:justify-between">
          <div className="w-36 mb-5" aria-hidden="true">
            <IconLogo color="#fff" aria-hidden={true} />
          </div>
         
          <address className="mb-5 text-sm">
            <a href="tel:+17207221775">+1 (720) 722-1775</a> | {ObfuscatedFooterEmail()}
          </address>
        </div>
         {/* ROW */}
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center text-center justify-center md:text-left text-sm gap-2 md:gap-4">
          <p className="mt-4 md:mt-0">&copy; {currentYear} A11Y Pros | All rights reserved.</p>
          <nav aria-label="Footer navigation" className="w-full md:w-auto">
            <ul className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
              <li>
                <Link href="/privacy-policy" className="text-white hover:text-[#d4e300]">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/accessibility-statement" className="text-white hover:text-[#d4e300]">Accessibility Statement</Link>
              </li>
              <li><Link href="/sitemap" className="text-white hover:text-[#d4e300]">Sitemap</Link></li>
            </ul>
          </nav>
        </div>
      </footer>
    </>
  );
};