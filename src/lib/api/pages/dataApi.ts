export async function getPageData(slug: string) {
	if (!process.env.NEXT_PUBLIC_CMS_URL) {
	  console.error("❌ ERROR: `NEXT_PUBLIC_CMS_URL` is not defined in `.env.local`");
	  return null;
	}
	
	const apiUrl = `${process.env.NEXT_PUBLIC_CMS_URL}/pages?slug=${slug}&_fields=id,slug,title,content,parent,featured_media`;
	
	try {
	  const res = await fetch(apiUrl, {
		cache: "no-store",
		headers: {
		  Authorization: `${process.env.NEXT_PUBLIC_WP_AUTH}`,
		},
	  });
	  
	  if (!res.ok) {
		console.error(`❌ ERROR: Failed to fetch page data (Status ${res.status})`);
		return null;
	  }
	  
	  const pages = await res.json();
	  if (!pages.length) return null;
	  
	  const page = pages[0];
	  
	  // Get featured image if exists
	  let featuredImage = null;
	  if (page.featured_media) {
		const mediaRes = await fetch(
		  `${process.env.NEXT_PUBLIC_CMS_URL}/media/${page.featured_media}?_fields=source_url,alt_text,caption`,
		  {
			headers: {
			  Authorization: `${process.env.NEXT_PUBLIC_WP_AUTH}`,
			},
		  }
		);
		
		if (mediaRes.ok) {
		  featuredImage = await mediaRes.json();
		}
	  }
	  
	  let parentSlug = null;
	  if (page.parent) {
		const parentRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/pages/${page.parent}?_fields=slug`, {
		  headers: {
			Authorization: `${process.env.NEXT_PUBLIC_WP_AUTH}`,
		  },
		});
		
		if (parentRes.ok) {
		  const parentData = await parentRes.json();
		  parentSlug = parentData.slug;
		}
	  }
	  
	  return { ...page, parentSlug, featuredImage };
	} catch (error) {
	  console.error("❌ ERROR: Fetch request to WordPress API failed", error);
	  return null;
	}
  }
  
  export async function getPageMetaData(slug: string) {
	if (!process.env.NEXT_PUBLIC_SEO_URL) return null;
	
	const apiUrl = `${process.env.NEXT_PUBLIC_SEO_URL}${process.env.NEXT_PUBLIC_URL}${slug}`;
	
	try {
	  const res = await fetch(apiUrl, { cache: "no-store" });
	  
	  if (!res.ok) return null;
	  
	  const seoData = await res.json();
	  const descriptionMatch = seoData.head.match(
		// 
	  );
	  
	  return { description: descriptionMatch ? descriptionMatch[1] : "" };
	} catch (error) {
	  console.error("❌ ERROR: Fetch request to SEO API failed", error);
	  return null;
	}
  }