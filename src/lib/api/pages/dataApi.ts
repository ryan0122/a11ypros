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
  
  import extractJsonLD from "@/utils/extractJsonLD";

  export async function getPageMetaData(slug: string) {
	if (!process.env.NEXT_PUBLIC_SEO_URL || !process.env.NEXT_PUBLIC_CMS_URL) return null;
	
	const seoApiUrl = `${process.env.NEXT_PUBLIC_SEO_URL}https://cms.a11ypros.com/${slug}`;
	
	try {
	  // ✅ Fetch description from existing SEO API
	  const seoRes = await fetch(seoApiUrl, { cache: "no-store" });
	  let seoDescription = "";
	
	  if (seoRes.ok) {
		const seoData = await seoRes.json();
		const descriptionMatch = seoData.head.match(/<meta name="description" content="(.*?)"\s*\/?>/i);
		seoDescription = descriptionMatch ? descriptionMatch[1] : "";
	  }
	
	  // ✅ Fetch RankMath metadata - Use the correct Rank Math API endpoint
	  const rankMathApiUrl = `${seoApiUrl}`;
	  const rankMathRes = await fetch(rankMathApiUrl);
	  let rankMathMeta = "";
	  let rankMathSchema = "";
	
	  if (rankMathRes.ok) {
		const rankMathData = await rankMathRes.json();
		
		// Extract description from Rank Math data
		if (rankMathData.head) {
		  rankMathMeta = rankMathData.head;
		  rankMathSchema = extractJsonLD(rankMathMeta);
		}
	  }
	
	  return { description: seoDescription, rankMathMeta, rankMathSchema };
	} catch (error) {
	  console.error("❌ ERROR: Fetch request to SEO API, RankMath, or WordPress failed", error);
	  return null;
	}
  }
  