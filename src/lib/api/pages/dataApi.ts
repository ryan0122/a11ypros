import extractJsonLD from "@/utils/extractJsonLD";

const CMS_URL = "https://cms.a11ypros.com";
const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://a11ypros.com";

/**
 * ✅ Fetch a single page by slug with RankMath metadata
 */
export async function getPageData(slug: string) {
  if (!CMS_URL) {
    console.error("❌ ERROR: `NEXT_PUBLIC_CMS_URL` is not defined in `.env.local`");
    return null;
  }

  const apiUrl = `${CMS_URL}/wp-json/wp/v2/pages?slug=${slug}&_fields=id,slug,title,content,parent,featured_media`;

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

    // ✅ Get featured image if available
    let featuredImage = null;
    if (page.featured_media) {
      try {
        const mediaRes = await fetch(
          `${CMS_URL}/wp-json/wp/v2/media/${page.featured_media}?_fields=source_url,alt_text,caption`,
          { headers: { Authorization: `${process.env.NEXT_PUBLIC_WP_AUTH}` } }
        );
        if (mediaRes.ok) {
          featuredImage = await mediaRes.json();
        }
      } catch (error) {
        console.error("⚠️ ERROR fetching featured image:", error);
      }
    }

    // ✅ Get parent page slug if it exists
    let parentSlug = null;
    if (page.parent) {
      try {
        const parentRes = await fetch(`${CMS_URL}/wp-json/wp/v2/pages/${page.parent}?_fields=slug`, {
          headers: { Authorization: `${process.env.NEXT_PUBLIC_WP_AUTH}` },
        });
        if (parentRes.ok) {
          const parentData = await parentRes.json();
          parentSlug = parentData.slug;
        }
      } catch (error) {
        console.error("⚠️ ERROR fetching parent page slug:", error);
      }
    }

    // ✅ Fetch RankMath metadata using `getHead` API
    let rankMathMeta = "";
    let rankMathSchema = "";
    try {
      const rankMathRes = await fetch(`${CMS_URL}/wp-json/rankmath/v1/getHead?url=${SITE_URL}/${slug}`);
      if (rankMathRes.ok) {
        const rankMathData = await rankMathRes.json();
        rankMathMeta = rankMathData.head || ""; // ✅ Extract RankMath meta tags
        rankMathSchema = extractJsonLD(rankMathMeta); // ✅ Extract JSON-LD schema
      }
    } catch (error) {
      console.error("❌ ERROR fetching RankMath metadata:", error);
    }

    return { ...page, parentSlug, featuredImage, rankMathMeta, rankMathSchema };
  } catch (error) {
    console.error("❌ ERROR: Fetch request to WordPress API failed", error);
    return null;
  }
}

/**
 * ✅ Fetch RankMath metadata for a given page
 */
export async function getPageMetaData(slug: string) {
  if (!CMS_URL) return null;

  try {
    const rankMathRes = await fetch(`${CMS_URL}/wp-json/rankmath/v1/getHead?url=${SITE_URL}/${slug}`);
    if (!rankMathRes.ok) return null;

    const rankMathData = await rankMathRes.json();
    const rankMathMeta = rankMathData.head || "";
    const rankMathSchema = extractJsonLD(rankMathMeta);

    return { rankMathMeta, rankMathSchema };
  } catch (error) {
    console.error("❌ ERROR: Fetch request to RankMath API failed", error);
    return null;
  }
}
