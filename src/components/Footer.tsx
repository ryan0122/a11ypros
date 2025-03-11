import ContactForm from "./ContactForm";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <section className="footer-form p-8">
        <ContactForm />
      </section>
      <footer className="bottom-footer flex flex-col md:flex-row items-center justify-center md:justify-evenly w-full gap-4 p-4">
        <nav aria-label="Footer navigation" className="order-1 md:order-2 w-full md:w-auto">
          <ul className="flex flex-col md:flex-row items-center md:items-center justify-center gap-4 md:gap-0">
            <li className="md:pr-2 md:mr-3">
              <Link href="/privacy-policy" className="text-white hover:text-[#d4e300]">Privacy Policy</Link>        
            </li>
            <li>        
              <Link href="/accessibility-statement" className="text-white hover:text-[#d4e300]">Accessibility Statement</Link>        
            </li>
          </ul>
        </nav>
        	<p className="order-2 md:order-1 text-center md:text-left mt-0">&copy; {currentYear} A11Y Pros</p>
      </footer>
    </>
  );
};