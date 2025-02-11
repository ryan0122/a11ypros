import { getPosts, Post } from "@/lib/api/posts/dataApi";

export default async function HomeTemplate({ title, content }: { title: string; content: string }) {
	const posts: Post[] = await getPosts(); // Fetch posts using centralized API function

	return (
	  <div className="items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
		<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
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
	              <a href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
	                <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
	              </a>
	            </li>
	          ))}
	        </ul>
		</section>
	  </div>
	);
  }