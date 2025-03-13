import Link from 'next/link';
import IconServiceAudit from './icons/IconServiceAudit';
import IconServiceRemediation from './icons/IconServiceRemediation';
import IconServiceReport from './icons/IconServiceReport';
import IconServiceConsulting from './icons/IconServiceConsulting';

const Services = () => (	
	
	<section className="w-full mx-auto bg-white">
		  {/* WCAG Compliance Auditing */}
		  <div className="flex flex-col sm:flex-row items-center sm:items-start py-10 sm:py-20 max-w-7xl mx-auto">
		    {/* For mobile: text first, then image */}
		    <div className="w-full order-2 sm:order-1 sm:w-2/5 text-center sm:text-left">
		      <div className="w-3/5 mx-auto sm:mx-0">
		        <IconServiceAudit/>
		      </div>
		    </div>
		    <div className="w-full order-1 sm:order-2 sm:w-3/5 px-10 sm:px-0 sm:pl-16 mb-8 sm:mb-0">
		      <h2 className="page-heading text-center sm:text-left">
		        <Link href="/services/wcag-compliance-auditing">WCAG Compliance Auditing</Link>
		      </h2>
		      <p className="text-center sm:text-left text-xl">Our web accessibility specialists help ensure your digital properties comply with legal requirements in the U.S. and internationally by aligning with the latest Web Content Accessibility Guidelines (WCAG).</p>
		    </div>
		  </div>

		  {/* Website Remediation */}
		  <div className="flex flex-col sm:flex-row items-center sm:items-start py-10 sm:py-20 max-w-7xl mx-auto">
		    {/* For mobile: text first, then image */}
		    <div className="w-full order-1 sm:w-3/5 px-10 sm:px-0 sm:pr-16 mb-8 sm:mb-0">
		      <h2 className="page-heading text-center sm:text-left">
		        <Link href="/services/website-remediation">Website Remediation</Link>
		      </h2>
		      <p className="text-center sm:text-left text-xl">A11Y Pros specializes in web accessibility remediation, helping businesses achieve ADA and WCAG compliance to meet U.S. and international accessibility standards. Our three-step process includes a comprehensive audit, code remediation, and final verification to ensure your website is fully accessible for all users.</p>
		    </div>
		    <div className="w-full order-2 sm:w-2/5 text-center">
		      <div className="w-3/5 mx-auto">
		        <IconServiceRemediation />
		      </div>
		    </div>
		  </div>

		  {/* VPAT & ACR Authoring */}
		  <div className="flex flex-col sm:flex-row items-center sm:items-start  py-10 sm:py-20 max-w-7xl mx-auto">
		    {/* For mobile: text first, then image */}
		    <div className="w-full order-2 sm:order-1 sm:w-2/5 text-center sm:text-left">
		      <div className="w-3/5 mx-auto sm:mx-0">
		        <IconServiceReport/>
		      </div>
		    </div>
		    <div className="w-full order-1 sm:order-2 sm:w-3/5 px-10 sm:px-0 sm:pl-16 mb-8 sm:mb-0">
		      <h2 className="page-heading text-center sm:text-left">
		        <Link href="/services/vpat-acr-authoring">VPAT & ACR Authoring</Link>
		      </h2>
		      <p className="text-center sm:text-left text-xl">We provide VPAT reporting to assess the accessibility of websites, SaaS platforms, web and mobile apps, and digital content. Our expert team creates Accessibility Conformance Reports (ACR) to help you demonstrate WCAG and ADA compliance, ensuring transparency and accessibility for all users.</p>
		    </div>
		  </div>

		  {/* Web Accessibility Consulting */}
		  <div className="flex flex-col sm:flex-row items-center sm:items-start py-10 sm:py-20 max-w-7xl mx-auto">
		    {/* For mobile: text first, then image */}
		    <div className="w-full order-1 sm:w-3/5 px-10 sm:px-0 sm:pr-16 mb-8 sm:mb-0">
		      <h2 className="page-heading text-center sm:text-left">
		        <Link href="/services/web-accessibility-consulting">Web Accessibility Consulting</Link>
		      </h2>
		      <p className="text-center sm:text-left text-xl">Our web accessibility experts ensure your digital platforms meet U.S. and international legal standards by adhering to the latest Web Content Accessibility Guidelines (WCAG). With a practical, solutions-driven approach, our ADA compliance consultants help your team navigate accessibility challenges and maintain full compliance.</p>
		    </div>
		    <div className="w-full order-2 sm:w-2/5 text-center">
		      <div className="w-3/5 mx-auto">
		        <IconServiceConsulting />
		      </div>
		    </div>
		  </div>
		</section>
);

export default Services;