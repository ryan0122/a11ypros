import { getPosts, Post } from "@/lib/api/posts/dataApi";

  export default async function Blog() {
	const posts: Post[] = await getPosts();
  
	return (
	  <div>
	 <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.id} className="border-b pb-4">
            <h2 className="text-2xl font-semibold">
              <a
                href={`/blog/${post.slug}`}
                className="text-blue-600 hover:underline"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </h2>
            <p className="text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            <a
              href={`/blog/${post.slug}`}
              className="inline-block mt-2 text-blue-500 hover:text-blue-700"
            >
              Read More →
            </a>
          </li>
        ))}
      </ul>
	  </div>
	);
  }
  