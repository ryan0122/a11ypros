export interface Post {
	id: number;
	title: { rendered: string };
	excerpt: { rendered: string };
	slug: string;
	date: string;
	author: number;
	author_name?: string;
	featured_media: number;
	featured_image_url?: string;
	_embedded?: {
	  "wp:featuredmedia"?: {
		source_url: string;
	  }[];
	  author?: {
		name: string;
	  }[];
	};
  }
  

export async function getPosts(): Promise<Post[]> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/posts?_embed=true`, {
		cache: "no-store", // Ensure fresh data
	});

	if (!res.ok) {
		throw new Error("Failed to fetch posts");
	}

	const posts = await res.json();
	
	// Process each post to extract featured image and author name
	return posts.map((post: Post) => {
		let featured_image_url = null;
		const author_name = "Unknown Author";
		
		// Extract featured image URL
		if (post._embedded && 
			post._embedded['wp:featuredmedia'] && 
			post._embedded['wp:featuredmedia'][0] &&
			post._embedded['wp:featuredmedia'][0].source_url) {
			featured_image_url = post._embedded['wp:featuredmedia'][0].source_url;
		}
		
		return {
			id: post.id,
			title: post.title,
			excerpt: post.excerpt,
			slug: post.slug,
			date: post.date,
			author: post.author,
			author_name: author_name,
			featured_media: post.featured_media,
			featured_image_url: featured_image_url
		};
	});
}

export async function getPostBySlug(slug: string) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/posts?slug=${slug}&_embed=true`);
	if (!res.ok) {
		return null;
	}

	const posts = await res.json();
	if (!posts.length) return null;

	const post = posts[0];

	// Extract featured image URL if it exists
	let featured_image_url = null;
	if (post._embedded && 
		post._embedded['wp:featuredmedia'] && 
		post._embedded['wp:featuredmedia'][0] &&
		post._embedded['wp:featuredmedia'][0].source_url) {
		featured_image_url = post._embedded['wp:featuredmedia'][0].source_url;
	}

	// Since the embedded author is returning an error, let's use a separate API call
	// but with error handling
	let author_name = "Unknown Author";
	try {
		const authorRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/users/${post.author}`);
		
		if (authorRes.ok) {
			const authorData = await authorRes.json();
			author_name = authorData.name || "Unknown Author";
		} else {
			// Try querying a public endpoint that might work
			const authorRes2 = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/users/${post.author}`);
			
			if (authorRes2.ok) {
				const authorData = await authorRes2.json();
				author_name = authorData.name || "Unknown Author";
			}
		}
	} catch (error) {
		console.log("Error fetching author:", error);
		author_name = "Unknown Author";
	}

	return {
		id: post.id,
		title: post.title,
		excerpt: post.excerpt,
		slug: post.slug,
		date: post.date,
		author: post.author,
		author_name: author_name,
		content: post.content,
		featured_media: post.featured_media,
		featured_image_url: featured_image_url
	};
}