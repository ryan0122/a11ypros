'use client';

import ContactForm from "@/components/forms/ContactForm";
import ContactPageForm from "@/components/forms/ContactPageForm";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import IconLogo from "@/components/icons/IconLogo";
import { ShieldCheck, CheckCircle2, Clock, Phone, Mail, ArrowRight, MapPin, ExternalLink } from "lucide-react";

const ObfuscatedEmail = () => {
  const email = 'info@a11ypros.com';
  const encoded = btoa(email);

  const handleClick = () => {
    const decoded = atob(encoded) as string;
    window.location.href = `mailto:${decoded}`;
  };

  return (
    <button type="button" onClick={handleClick} className="email-link flex items-center gap-2 text-slate-700 hover:text-[#084A3B] transition-colors">
      <Mail className="w-4 h-4 text-[#084A3B]" /> info@a11ypros.com
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
    <button type="button" onClick={handleClick} className="email-link text-white hover:text-emerald-300 transition-colors">
      info@a11ypros.com
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
      {/* Top CTA / Form Section */}
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
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#084A3B]/10 text-[#084A3B] text-xs font-bold uppercase tracking-wider">
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
                      <CheckCircle2 className="w-5 h-5 text-[#084A3B] shrink-0" />
                      <span>100% Certified Manual Screen Reader Testing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#084A3B] shrink-0" />
                      <span>Proposal response within 1 business day</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#084A3B] shrink-0" />
                      <span>Audit-ready Section 508 & WCAG 2.1/2.2 AA coverage</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-6 text-sm font-medium">
                    <a href="tel:+17207221775" className="flex items-center gap-2 text-slate-700 hover:text-[#084A3B] transition-colors">
                      <Phone className="w-4 h-4 text-[#084A3B]" /> +1 (720) 722-1775
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#084A3B]/10 text-[#084A3B] text-xs font-bold uppercase tracking-wider mb-3">
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

      {/* Modern Multi-Column Footer */}
      <footer className="w-full bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800 font-[family-name:var(--font-inter)]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Main 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            {/* Column 1: Brand & Contact Info (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="w-44 mb-2">
                <IconLogo color="#fff" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Certified web & mobile accessibility auditing, VPAT® / ACR authoring, and ADA litigation defense powered by 100% manual human testing.
              </p>
              <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href="tel:+17207221775" className="text-white hover:text-emerald-300 transition-colors">+1 (720) 722-1775</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  {ObfuscatedFooterEmail()}
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-400">1905 Sherman St, Ste 200 #2042, Denver, CO 80203</span>
                </div>
              </div>
            </div>

            {/* Column 2: Services (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Accessibility Services</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                <li>
                  <Link href="/services/wcag-compliance-auditing" className="hover:text-emerald-300 transition-colors">
                    WCAG 2.1/2.2 Manual Audits
                  </Link>
                </li>
                <li>
                  <Link href="/services/vpat-vpat-2-0-authoring-services" className="hover:text-emerald-300 transition-colors">
                    VPAT® & ACR Authoring
                  </Link>
                </li>
                <li>
                  <Link href="/services/website-remediation-services" className="hover:text-emerald-300 transition-colors">
                    Website Remediation
                  </Link>
                </li>
                <li>
                  <Link href="/services/ada-litigation-support" className="hover:text-emerald-300 transition-colors">
                    ADA Litigation Support
                  </Link>
                </li>
                <li>
                  <Link href="/services/pdf-remediation-services" className="hover:text-emerald-300 transition-colors">
                    PDF Document Remediation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Tools & Resources (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Tools & Resources</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                <li>
                  <Link href="/vpat-estimator" className="hover:text-emerald-300 transition-colors">
                    VPAT® Scope Calculator
                  </Link>
                </li>
                <li>
                  <a
                    href="https://ui.a11ypros.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1 text-emerald-400 font-semibold"
                  >
                    A11Y UI Component Library <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <Link href="/free-accessibility-audit" className="hover:text-white transition-colors">
                    Free Manual Teaser Audit
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Accessibility Articles
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Standards (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Standards</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                <li>
                  <Link href="/compliance/web-content-accessibility-guidelines" className="hover:text-white transition-colors">
                    WCAG 2.1 / 2.2 AA
                  </Link>
                </li>
                <li>
                  <Link href="/compliance/section-508" className="hover:text-white transition-colors">
                    Section 508 (US)
                  </Link>
                </li>
                <li>
                  <Link href="/compliance/the-americans-with-disabilities-act" className="hover:text-white transition-colors">
                    ADA Title III
                  </Link>
                </li>
                <li>
                  <Link href="/compliance/en-301-549" className="hover:text-white transition-colors">
                    EN 301 549 (EU)
                  </Link>
                </li>
                <li>
                  <Link href="/compliance/the-accessible-canada-act-aca/" className="hover:text-white transition-colors">
                    ACA & AODA (CA)
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Legal Links Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>&copy; {currentYear} A11Y Pros | All rights reserved.</p>
            <nav aria-label="Footer legal navigation">
              <ul className="flex flex-wrap items-center gap-6">
                <li>
                  <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility-statement" className="hover:text-slate-300 transition-colors">
                    Accessibility Statement
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="hover:text-slate-300 transition-colors">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
};