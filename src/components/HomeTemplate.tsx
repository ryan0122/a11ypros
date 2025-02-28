import { getPosts, Post } from "@/lib/api/posts/dataApi";

export default async function HomeTemplate({ title, content }: { title: string; content: string }) {
	const posts: Post[] = await getPosts(); // Fetch posts using centralized API function

	return (
	  <div className="items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
		<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-7xl mx-auto">
			<div className=" isolate px-6 pt-14 lg:px-8 mx-auto">
			    <div className="py-32 sm:py-48 lg:py-56">
			      <div className="text-center">
			        <h1 className="text-4xl tracking-tight text-balance text-gray-900 sm:text-4xl">
					ADA & Section 508 WCAG <span className="font-semibold block">Web Accessibility Compliance Consultants</span>
					</h1>
			        <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">The premier providers of web accessibility services.</p>
			      </div>
			    </div>
			    <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
			      <div className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
			    </div>
	  		</div>

			<header className="hero-section">
				<h1 dangerouslySetInnerHTML={{ __html: title }} />
	     	 </header>
      		<section className="content" dangerouslySetInnerHTML={{ __html: content }} />
		</main>
		<section className="items-center text-center">
			<h2>Latest News and Articles</h2>
			{/* render blog posts here */}
			<ul className="list-none mt-4">
	          {posts.map((post: Post) => (
	            <li key={post.id} className="mt-2">
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