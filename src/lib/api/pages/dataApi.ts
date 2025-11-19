import extractJsonLD from "@/utils/extractJsonLD";

interface FAQItem {
	faq_question: string;
	faq_answer: string;
  }

export async function getPageData(slug: string) {
	if (!process.env.NEXT_PUBLIC_CMS_URL) {
	  console.error("❌ ERROR: `NEXT_PUBLIC_CMS_URL` is not defined in `.env.local`");
	  return null;
	}
	
	const apiUrl = `${process.env.NEXT_PUBLIC_CMS_URL}/pages?slug=${slug}&_fields=id,slug,title,content,parent,featured_media,acf&acf_format=standard`;
	
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

	  let faqs: { question: string; answer: string }[] = [];

	  if (Array.isArray(page.acf?.['faq-acf-repeater'])) {
		faqs = (page.acf['faq-acf-repeater'] as FAQItem[]).map((faq) => ({
		  question: faq.faq_question,
		  answer: faq.faq_answer,
		}));
	  }
	  
	  return { ...page, parentSlug, featuredImage, faqs };
	} catch (error) {
	  console.error("❌ ERROR: Fetch request to WordPress API failed", error);
	  return null;
	}
  }
  

  export async function getPageMetaData(slug: string) {
	if (!process.env.NEXT_PUBLIC_SEO_URL) return null;
  
	const headUrl = `${process.env.NEXT_PUBLIC_SEO_URL}/wp-json/rankmath/v1/getHead?url=https://cms.a11ypros.com/${slug}`;
	console.log('HEAD URL', headUrl);
  
	try {
	  const res = await fetch(headUrl, {
		cache: "no-store",
	  });
  
	  if (!res.ok) {
		console.error("Rank Math getHead failed:", res.status);
		return null;
	  }
  
	  const data = await res.json();  // ← Returns { head: "<meta ...>", json_ld: "{...full schema including your ACF FAQ...}" }
  
	  // Extract description from the head HTML
	  const descriptionMatch = data.head?.match(/<meta name="description" content="(.*?)"\s*\/?>/i);
	  const description = descriptionMatch ? descriptionMatch[1] : "";
  
	  return {
		description,
		rankMathSchema: data.json_ld || null,   // ← This includes your FAQPage from the custom snippet!
	  };
	} catch (error) {
	  console.error("getHead request failed:", error);
	  return null;
	}
  }
  
  