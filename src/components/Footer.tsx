import ContactForm from "./ContactForm";
import Link from "next/link";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<>
			<section className="p-8 bg-white">
				<ContactForm />
			</section>
			<footer className="bottom-footer flex flex-row items-center justify-evenly w-full py-2">
				<p>&copy; {currentYear} A11Y Pros</p>
				<nav aria-label="Footer navigation" className="">
		            <ul className="inline-flex flex-row justify-between items-center">
						<li className="pr-2 mr-3">
							<Link href="/privacy-policy" className="text-white hover:text-[#d4e300]">Privacy Policy</Link>        
						</li>
		        		<li>        
							<Link href="/accessibility-statement" className="text-white hover:text-[#d4e300]">Accessibility Statement</Link>        
						 </li>
					</ul>
              	</nav>
			</footer>
		</>
	  );
};