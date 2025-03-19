import extractJsonLD from "@/utils/extractJsonLD";

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
  content?: { rendered: string };
  rankMathMeta?: string;
  rankMathSchema?: string;
  seoDescription?: string; // ✅ Add SEO meta description field
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string }[];
    author?: { name: string }[];
  };
}

const CMS_URL = "https://cms.a11ypros.com";
const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://a11ypros.com";

/**
 * ✅ Fetch all blog posts with RankMath metadata
 */
export async function getPosts(): Promise<Post[]> {
  const res = await fetch(
    `${CMS_URL}/wp-json/wp/v2/posts?_embed=true&_fields=id,slug,title,excerpt,date,author,featured_media,_embedded`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts = await res.json();

  return await Promise.all(
    posts.map(async (post: Post) => {
      const featured_image_url = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
      let author_name = "Unknown Author";
      let seoDescription = "";

      // ✅ Fetch author name
      try {
        const authorRes = await fetch(`${CMS_URL}/wp-json/wp/v2/users/${post.author}`);
        if (authorRes.ok) {
          const authorData = await authorRes.json();
          author_name = authorData.name || "Unknown Author";
        }
      } catch (error) {
        console.error("Error fetching author:", error);
      }

      // ✅ Fetch RankMath metadata
      let rankMathMeta = "";
      let rankMathSchema = "";
      try {
        const rankMathRes = await fetch(`${CMS_URL}/wp-json/rankmath/v1/getHead?url=${SITE_URL}/blog/${post.slug}`);
        if (rankMathRes.ok) {
          const rankMathData = await rankMathRes.json();
          rankMathMeta = rankMathData.head || "";
          rankMathSchema = extractJsonLD(rankMathMeta);
          seoDescription = extractMetaDescription(rankMathMeta); // ✅ Extract description
        }
      } catch (error) {
        console.error("Error fetching RankMath metadata:", error);
      }

      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        date: post.date,
        author: post.author,
        author_name,
        featured_media: post.featured_media,
        featured_image_url,
        rankMathMeta,
        rankMathSchema,
        seoDescription,
      };
    })
  );
}

/**
 * ✅ Fetch a single blog post by slug with RankMath metadata
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(
    `${CMS_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed=true&_fields=id,slug,title,excerpt,content,date,author,featured_media,_embedded`
  );

  if (!res.ok) {
    return null;
  }

  const posts = await res.json();
  if (!posts.length) return null;

  const post = posts[0];

  const featured_image_url = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
  let author_name = "Unknown Author";
  let seoDescription = "";

  // ✅ Fetch author name
  try {
    const authorRes = await fetch(`${CMS_URL}/wp-json/wp/v2/users/${post.author}`);
    if (authorRes.ok) {
      const authorData = await authorRes.json();
      author_name = authorData.name || "Unknown Author";
    }
  } catch (error) {
    console.error("Error fetching author:", error);
  }

  // ✅ Fetch RankMath metadata
  let rankMathMeta = "";
  let rankMathSchema = "";
  try {
    const rankMathRes = await fetch(`${CMS_URL}/wp-json/rankmath/v1/getHead?url=${CMS_URL}/${slug}`);
    if (rankMathRes.ok) {
      const rankMathData = await rankMathRes.json();
      rankMathMeta = rankMathData.head || "";
      rankMathSchema = extractJsonLD(rankMathMeta);
      seoDescription = extractMetaDescription(rankMathMeta); // ✅ Extract description
    }
  } catch (error) {
    console.error("Error fetching RankMath metadata:", error);
  }

  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    date: post.date,
    author: post.author,
    author_name,
    content: post.content,
    featured_media: post.featured_media,
    featured_image_url,
    rankMathMeta,
    rankMathSchema,
    seoDescription,
  };
}

/**
 * ✅ Extracts <meta name="description"> content from RankMath metadata
 */
function extractMetaDescription(htmlString: string): string {
  const regex = /<meta name="description" content="(.*?)"\s*\/?>/i;
  const match = regex.exec(htmlString);
  return match ? match[1] : "";
}
