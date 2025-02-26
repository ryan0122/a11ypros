import ContactForm from "./ContactForm";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<>
			<section className="bg-gray-800 text-white p-8">
				<ContactForm />
			</section>
			<footer className="footer flex flex-row items-center justify-evenly w-full">
				<p>&copy; {currentYear} A11Y Pros</p>
				<nav aria-label="Footer navigation" className="">
		            <ul>
						<li>
							<a href="/policies/privacy/privacy-policy/" title="Privacy">Privacy Policy</a>        
						</li>
		        		<li>        
							<a href="/policies/accessibility/accessibility-statement/" title="Accessibility Statement">Accessibility Statement</a>        
						 </li>
					</ul>
              	</nav>
			</footer>
		</>
	  );
};