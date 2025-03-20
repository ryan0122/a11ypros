'use client';

import ContactForm from "./ContactForm";
import ContactPageForm from "./ContactPageForm";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


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

  const doNotDisplay = ["/contact-us-thank-you"].includes(pathname) || is404 || pathname === "";

  return (
    <>
      {!doNotDisplay && (
         <section className="footer-form p-8">
          {pathname === '/contact-us' ? <ContactPageForm /> : <ContactForm />}
         </section>
       )}
      <footer className="bottom-footer flex flex-col items-center md:flex-row md:justify-evenly w-full gap-4 p-4">
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
          
          {/* Navigation Menu */}
          <nav aria-label="Footer navigation" className="w-full md:w-auto">
            <ul className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
              <li>
                <Link href="/privacy-policy" className="text-white hover:text-[#d4e300]">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/accessibility-statement" className="text-white hover:text-[#d4e300]">Accessibility Statement</Link>
              </li>
            </ul>
          </nav>

          {/* Copyright Text - Moves Below Nav on Mobile */}
          <p className="mt-4 md:mt-0">&copy; {currentYear} A11Y Pros</p>
        </div>
      </footer>

    </>
  );
};