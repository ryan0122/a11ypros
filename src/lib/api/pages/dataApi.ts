export async function getPageData(slug: string) {
	if (!process.env.NEXT_PUBLIC_CMS_URL) {
	  console.error("❌ ERROR: `NEXT_PUBLIC_CMS_URL` is not defined in `.env.local`");
	  return null;
	}
  
	const apiUrl = `${process.env.NEXT_PUBLIC_CMS_URL}/pages?slug=${slug}&_fields=id,slug,title,content`;
  
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
	  console.log("✅ WordPress API Response:", pages);
  
	  return pages.length > 0 ? pages[0] : null;
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
		/<meta\s+name=["']description["']\s+content=["']([^"']+)["']\s*\/?>/
	  );
  
	  return { description: descriptionMatch ? descriptionMatch[1] : "" };
	} catch (error) {
	  console.error("❌ ERROR: Fetch request to SEO API failed", error);
	  return null;
	}
  }