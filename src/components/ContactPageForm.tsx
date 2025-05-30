import ContactForm from "./ContactForm"; 
import Image from "next/image";
 
 const ContactPageForm = () => { 
	 return (
	  <div className="flex flex-col md:flex-row gap-6 md:gap-12 max-w-6xl mx-auto px-8">
	  {/* Left Column - Address */}
	   <div className="w-full md:w-1/2 text-left text-xl">
		   <h2 className="my-10">Reach out to ensure your website meets accessibility standards.</h2>
		   <div className="flex items-start gap-3 mb-10">
			   {/* Icon */}
			   <Image src="/phone_icon.svg" alt="USA Address" className="w-8 h-8" width={100} height={100}/>
			   <div className="flex flex-col">
				 <p className="font-semibold mt-0">Phone:</p>
				 <p className="mt-0">
				   <a href="tel:17207221775">
					 +1 (720) 722-1775
				   </a>
				 </p>
			   </div>
			 </div>
			 <div className="flex items-start gap-3 mb-10">
			   {/* Email Icon */}
			   <Image src="/email_icon.svg" alt="" className="w-8 h-8" width={100} height={100}/>
			   <div className="flex flex-col">
				 <p className="font-semibold mt-0">Email:</p>
				 <p className="mt-0">
				   <a href="mailto:info@a11ypros.com">
					 info@a11ypros.com
				   </a>
				 </p>
			   </div>
			 </div>

			  <div className="flex items-start gap-3 mt-4">
			   {/* Location Icon */}
			   <Image src="/location_icon.svg" alt="" className="w-8 h-8 mt-1" width={100} height={100}/>

			   {/* Address */}
			   <address className="not-italic">
				 <p className="font-semibold mt-0">USA Address:</p>
				 <p className="m-0">
				   1905 Sherman Street<br />
				   Ste 200 #2042<br />
				   Denver, CO 80203
				 </p>
			   </address>
			 </div>

		</div>
	  
		{/* Right Column - Contact Form */}
		<div className="w-full md:w-1/2">
		  <ContactForm isMainContactForm />
		</div>
	  </div>
	);
 };

 export default ContactPageForm;