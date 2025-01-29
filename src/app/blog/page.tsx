interface Post {
	id: number;
	title: { rendered: string };
  }

  const authHeader = "Basic YTExeXByb2NtczpOQlZPIHRkOFogSHlxTyBoVmYzIHVtVEEgZkhjUg==";
  
  async function getPosts(): Promise<Post[]> {
	const res = await fetch(`${process.env.CMS_URL}/posts`, {
	  cache: "no-store", // Ensure fresh data
	  headers: {
		Authorization: authHeader,
	  },
	});
  
	if (!res.ok) {
	  throw new Error("Failed to fetch posts");
	}
  
	return res.json();
  }
  
  export default async function Blog() {
	const posts = await getPosts();
  
	return (
	  <div>
		{posts.map((post) => (
		  <h2 key={post.id} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
		))}
	  </div>
	);
  }
  