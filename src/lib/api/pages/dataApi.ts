import extractJsonLD from "@/utils/extractJsonLD";

export async function getPageData(slug: string) {
	if (!process.env.NEXT_PUBLIC_CMS_URL) {
	  console.error("❌ ERROR: `NEXT_PUBLIC_CMS_URL` is not defined in `.env.local`");
	  return null;
	}
	
	const apiUrl = `${process.env.NEXT_PUBLIC_CMS_URL}/pages?slug=${slug}&_fields=id,slug,title,content,parent,featured_media,acf`;
	
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

	  let faqs = [];
	  if (page.acf?.['faq-acf-repeater']) {
		faqs = page.acf['faq-acf-repeater'].map((faq) => ({
		  question: faq['faq_question'],
		  answer: faq['faq_answer'],
		}));
	  }
	  
	  return { ...page, parentSlug, featuredImage, faqs };
	} catch (error) {
	  console.error("❌ ERROR: Fetch request to WordPress API failed", error);
	  return null;
	}
  }
  

  export async function getPageMetaData(slug: string) {
	if (!process.env.NEXT_PUBLIC_SEO_URL || !process.env.NEXT_PUBLIC_CMS_URL) return null;
  
	const seoApiUrl = `${process.env.NEXT_PUBLIC_SEO_URL}https://cms.a11ypros.com/${slug}`;
  
	try {
	  // ✅ Fetch RankMath metadata & SEO data in a single request
	  const res = await fetch(seoApiUrl, {
		cache: "no-store",
		method: "GET",
		headers: {
		  Authorization: `${process.env.NEXT_PUBLIC_WP_AUTH}`,
		  "Cache-Control": "no-cache",
		},
	  });
  
	  if (!res.ok) {
		console.error("❌ ERROR: Failed to fetch RankMath metadata:", res.status);
		return null;
	  }
  
	  const data = await res.json();
  
	  // ✅ Extract description from meta tags
	  let seoDescription = "";
	  const descriptionMatch = data.head?.match(/<meta name="description" content="(.*?)"\s*\/?>/i);
	  if (descriptionMatch) {
		seoDescription = descriptionMatch[1];
	  }
  
	  // ✅ Extract JSON-LD & FAQs from RankMath
	  const rankMathMeta = data.head || "";
	  const rankMathSchema = extractJsonLD(rankMathMeta);
  
	  return { description: seoDescription, rankMathMeta, rankMathSchema};
	} catch (error) {
	  console.error("❌ ERROR: Fetch request to RankMath API failed:", error);
	  return null;
	}
  }
  
  