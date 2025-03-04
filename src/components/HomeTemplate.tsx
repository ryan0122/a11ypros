import { getPosts, Post } from "@/lib/api/posts/dataApi";

export default async function HomeTemplate({ content }: { title: string; content: string }) {
	const posts: Post[] = await getPosts(); // Fetch posts using centralized API function

	return (
	  <div className="font-[family-name:var(--font-geist-sans)]">
		<div className="home-hero isolate px-6 pt-14 lg:px-8 mx-auto w-full">
		    <div className="py-32 sm:py-48 lg:py-56">
		      <header className="text-center">
		        <h1 className="tracking-tight text-balance text-3xl md:text-5xl">
				ADA & Section 508 WCAG <span className="font-semibold block">Web Accessibility Compliance Consultants</span>
				</h1>
		        <p className="mt-8 text-lg font-medium text-pretty sm:text-xl/8">The premier providers of web accessibility services.</p>
		      </header>
		    </div>
		    <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
		      <div className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
		    </div>
  		</div>
		<main id="mainContent" className="max-w-7xl mx-auto py-10 px-10 text-center">
      		<section className="content" dangerouslySetInnerHTML={{ __html: content }} />
		</main>
		<section className="items-center text-center max-w-7xl mx-auto py-20 px-10">
			<h2 className="page-heading">Latest News and Articles</h2>
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