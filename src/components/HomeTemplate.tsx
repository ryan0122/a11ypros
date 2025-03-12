import { getPosts, Post } from "@/lib/api/posts/dataApi";
import Link from "next/link";
import IconA11yCollab from "@/components/icons/IconA11yCollab"
import IconServiceAudit from "./icons/IconServiceAudit";
import IconServiceRemediation from "./icons/IconServiceRemediation";
import IconServiceReport from "./icons/IconServiceReport";
import IconServiceConsulting from "./icons/IconServiceConsulting";

export default async function HomeTemplate({ content }: { title: string; content: string }) {
	const posts: Post[] = await getPosts(); // Fetch posts using centralized API function

	return (
	  <div className="font-[family-name:var(--font-inter)]">
		<div className="home-hero isolate px-6 py-14 lg:px-8 mx-auto w-full pt-0 sm:pt-14">
		    <div className="">
		      <header className="text-center">
				<div className="flex justify-center items-center mx-auto">
					<IconA11yCollab aria-hidden="true"/>
				</div>
		        <h1 className="tracking-tight text-balance text-3xl md:text-5xl">
				ADA & Section 508 WCAG <span className="font-semibold block">Web Accessibility Compliance Consultants</span>
				</h1>
		      </header>
		    </div>
  		</div>
		<main id="mainContent" className="home-content py-10 px-10 text-center w-full isolate ">
      		<section className="content max-w-7xl mx-auto" dangerouslySetInnerHTML={{ __html: content }} />
		</main>
		<section className="w-full mx-auto bg-white">
		  {/* WCAG Compliance Auditing */}
		  <div className="flex flex-col sm:flex-row items-center sm:items-start py-20 max-w-7xl mx-auto">
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
		  <div className="flex flex-col sm:flex-row items-center sm:items-start py-20 max-w-7xl mx-auto">
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
		  <div className="flex flex-col sm:flex-row items-center sm:items-start py-20 max-w-7xl mx-auto">
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
		  <div className="flex flex-col sm:flex-row items-center sm:items-start py-20 max-w-7xl mx-auto">
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
		<section className="items-center text-center max-w-7xl mx-auto py-20 px-10">
			<h2 className="page-heading">Accessibility Articles</h2>
			{/* render blog posts here */}
			<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
	          {posts.map((post: Post) => (
	            <li key={post.id} className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
	              <a href={`/blog/${post.slug}`}>
	                <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
	              </a>
	            </li>
	          ))}
	        </ul>
		</section>
	  </div>
	);
  }