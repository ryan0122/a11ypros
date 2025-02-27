import ContactForm from "./ContactForm";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<>
			<section className="bg-gray-800 text-white p-8">
				<ContactForm />
			</section>
			<footer className="footer flex flex-row items-center justify-evenly w-full py-2">
				<p>&copy; {currentYear} A11Y Pros</p>
				<nav aria-label="Footer navigation" className="">
		            <ul className="inline-flex flex-row justify-between items-center">
						<li className="border-r border-gray-800 pr-2 mr-2">
							<a href="/privacy-policy">Privacy Policy</a>        
						</li>
		        		<li>        
							<a href="/accessibility-statement">Accessibility Statement</a>        
						 </li>
					</ul>
              	</nav>
			</footer>
		</>
	  );
};