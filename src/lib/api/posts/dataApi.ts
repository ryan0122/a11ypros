export interface Post {
	id: number;
	title: { rendered: string };
	excerpt: { rendered: string };
  	slug: string;
  }
  
  export async function getPosts(): Promise<Post[]> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/posts`, {
	  cache: "no-store", // Ensure fresh data
	});
  
	if (!res.ok) {
	  throw new Error("Failed to fetch posts");
	}
  
	return res.json();
  }

  export async function getPostBySlug(slug: string) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/posts?slug=${slug}`);
  
	if (!res.ok) {
	  return null;
	}
  
	const posts = await res.json();
	return posts.length > 0 ? posts[0] : null;
  }