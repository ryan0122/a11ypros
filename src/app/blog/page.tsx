import { getPosts, Post } from "@/lib/api/posts/dataApi";

export default async function Blog() {
  const posts: Post[] = await getPosts(); // ✅ Fetches data on the server before rendering

  return (
	<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<header className="text-center mb-12">
			<h1 className="text-3xl font-semibold mb-6">Web Accessibility & ADA Compliance Articles</h1>
		</header>
	  
	  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		{posts.map((post) => (
		  <li key={post.id} className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
			<h2 className="text-2xl font-semibold mb-4">
			  <a
				href={`/blog/${post.slug}`}
				dangerouslySetInnerHTML={{ __html: post.title.rendered }}
			  />
			</h2>
			<p
			  className="text-gray-700 mb-4"
			  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
			/>
			<a
			  href={`/blog/${post.slug}`}
			  className="inline-block mt-2"
			>
			  Read More →
			</a>
		  </li>
		))}
	  </ul>
	</main>
  );
}
