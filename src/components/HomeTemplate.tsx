import { getPosts, Post } from "@/lib/api/posts/dataApi";
import Services from "./Services";
import Compliances from "./Compliances";
import IconHomeHero from "@/components/icons/IconHomeHero";
import Image from "next/image";
import Link from "next/link";
import IconManualAudit from './icons/IconManualAudit'

export default async function HomeTemplate({ content }: { title: string; content: string }) {
	const posts: Post[] = await getPosts(); // Fetch posts using centralized API function

	return (
	  <div className="font-[family-name:var(--font-inter)]">
		<div className="home-hero isolate px-6 py-14 lg:px-8 mx-auto w-full pt-0 sm:pt-14">
		<div className="flex flex-col md:flex-row items-center justify-between text-left gap-6 max-w-6xl mx-auto">
		  <h1 className="tracking-tight text-balance text-4xl md:text-5xl md:w-1/2">
		    WCAG, ADA & Section 508  
		    <span className="font-semibold block">
		      Web Accessibility Compliance Consultants
		    </span>
		  </h1>

		  <div className="md:w-1/2 flex justify-center">
		    <IconHomeHero aria-hidden="true" />
		  </div>
		</div>
  		</div>
		<main id="mainContent">
      		<section className="home-content text-center w-full isolate py-10">
				<div className="content max-w-6xl mx-auto text-xl px-10"  dangerouslySetInnerHTML={{ __html: content }}/>
			</section>
			<section className="max-full bg-white">
				<div className="max-w-6xl mx-auto pt-10 pb-20 flex flex-col md:flex-row items-center gap-6">
					<div className="flex-shrink-0 md:w-1/2">
						<IconManualAudit />
					</div>
					<div className="md:w-1/2 text-center md:text-left px-10 md:px-0">
						<h3>Why WCAG Testing for ADA Web Compliance Requires Manual Auditing</h3>
						<p className="text-xl">Automated accessibility testing tools, including those with AI capabilities, are essential for identifying certain web accessibility issues efficiently. However, these tools alone can only detect about 40% of WCAG success criteria, leaving a significant gap that requires manual human testing to ensure full compliance.</p>
						<p className="text-center text-xl"><strong>Manual human testing. No Shortcuts. <br/>Expert Audits for True WCAG Compliance.</strong></p>
					</div>
				</div>
			</section>
		</main>
		<Compliances showHeading={true}/>
		<Services showHeading/>
		<section className="items-center text-center max-w-6xl mx-auto pt-10 pb-20 px-10">
			<h2 className="page-heading">Accessibility Articles</h2>
			{/* render blog posts here */}
			<ul className="articles-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
	          {posts.slice(0, 6).map((post: Post) => (
	            <li key={post.id} className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
	              <Link href={`/blog/${post.slug}`}>
				  {/* ✅ Featured Image */}
				  {post.featured_image_url && (
			          <div className="mb-4">
			            <Image
			              src={post.featured_image_url}
			              alt={`${post.title.rendered}`}
			              className="w-full h-48"
			              loading="lazy"
						  width={100}
						  height={100}
			            />
			          </div>
					)}
	                <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
	              </Link>
	            </li>
	          ))}
	        </ul>
			{/* View More Link */}
			  <div className="mt-12">
				<Link 
				  href="/blog" 
				  className="text-xl inline-block hover:underline font-semibold border-2 border-[#0E8168] rounded-lg px-4 py-2"
				>
				  View All Articles
				</Link>
			  </div>
		</section>
	  </div>
	);
  }