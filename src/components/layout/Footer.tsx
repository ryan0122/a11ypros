'use client';

import ContactForm from "@/components/forms/ContactForm";
import ContactPageForm from "@/components/forms/ContactPageForm";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import IconLogo from "@/components/icons/IconLogo";

const ObfuscatedEmail = () => {
  const email = 'info@a11ypros.com';
  const encoded = btoa(email); // Base64 encode

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const decoded = atob(encoded) as string;
    window.location.href = `mailto:${decoded}`;
  };

  return (
    <a href="#" onClick={handleClick} className="email-link">
      Email Us
    </a>
  );
};


export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname(); // Get the current route
  const [is404, setIs404] = useState(false);

   // ✅ Detect 404 pages by checking document title
   useEffect(() => {
      if (document.title.includes("Page Not Found")) {
        setIs404(true);
      } else {
        setIs404(false);
      }
    }, []);

  const doNotDisplay = ["/sitemap", "/free-accessibility-test", "/free-consultation", "/contact-us-thank-you", "/accessibility-statement", "/privacy-policy"].includes(pathname) || is404 || pathname === "";

  return (
    <>
      {!doNotDisplay && (
         <section className="footer-form p-8">
          {pathname === '/contact-us' ? <ContactPageForm /> : <ContactForm />}
         </section>
       )}
      <footer className="bottom-footer w-full gap-4 p-4">
        {/* ROW */}
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center md:justify-between">
          <div className="w-36 mb-5">
            <IconLogo color="#fff"/>
          </div>
         
          <address className="mb-5">
            <a href="tel:+17207221775">+1 (720) 722-1775</a> | {ObfuscatedEmail()}
          </address>
        </div>
         {/* ROW */}
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center text-center justify-center md:text-left text-sm  gap-2 md:gap-4">
          {/* Copyright Text - Moves Below Nav on Mobile */}
          <p className="mt-4 md:mt-0">&copy; {currentYear} A11Y Pros | All rights reserved.</p>
          {/* Navigation Menu */}
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