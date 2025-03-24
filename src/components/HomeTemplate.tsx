import { getPosts, Post } from "@/lib/api/posts/dataApi";
import Services from "./Services";
import Compliances from "./Compliances";
import IconA11yCollab from "@/components/icons/IconA11yCollab"
import Image from "next/image";
import Link from "next/link";

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
		        <h1 className="tracking-tight text-balance text-2xl sm:text-3xl md:text-5xl">
					WCAG, ADA & Section 508  <span className="font-semibold block">Web Accessibility Compliance Consultants</span>
				</h1>
		      </header>
		    </div>
  		</div>
		<main id="mainContent" className="home-content py-10 px-10 text-center w-full isolate ">
      		<section className="content max-w-6xl mx-auto text-xl" dangerouslySetInnerHTML={{ __html: content }} />
		</main>
		<Compliances showHeading={true}/>
		<Services showHeading/>
		<section className="items-center text-center max-w-6xl mx-auto pt-10 pb-20 px-10">
			<h2 className="page-heading">Accessibility Articles</h2>
			{/* render blog posts here */}
			<ul className="articles-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
	          {posts.map((post: Post) => (
	            <li key={post.id} className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
	              <Link href={`/blog/${post.slug}`}>
				  {/* ✅ Featured Image */}
				  {post.featured_image_url && (
			          <div className="mb-4">
			            <Image
			              src={post.featured_image_url}
			              alt={`Featured image for ${post.title.rendered}`}
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
		</section>
	  </div>
	);
  }