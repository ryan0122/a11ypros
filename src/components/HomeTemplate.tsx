import { getPosts, Post } from "@/lib/api/posts/dataApi";
import A11yCollabIcon from "@/components/icons/IconA11yCollab"
import ServiceAuditIcon from "./icons/IconServiceAudit";

export default async function HomeTemplate({ content }: { title: string; content: string }) {
	const posts: Post[] = await getPosts(); // Fetch posts using centralized API function

	return (
	  <div className="font-[family-name:var(--font-inter)]">
		<div className="home-hero isolate px-6 py-14 lg:px-8 mx-auto w-full pt-0 sm:pt-14">
		    <div className="">
		      <header className="text-center">
				<div className="flex justify-center items-center mx-auto">
					<A11yCollabIcon aria-hidden="true"/>
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
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
				<div>
					<h2 className="page-heading text-center">WCAG Compliance Auditing</h2>
					<ServiceAuditIcon/>
				</div>
				<div>
					<h2 className="page-heading text-center">Website Remediation</h2>
				</div>
				<div>
					<h2 className="page-heading text-center">VPAT & ACR Authoring</h2>
				</div>
				<div>
					<h2 className="page-heading text-center">Web Accessibility Consulting</h2>
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