import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://a11ypros.com";
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "https://cms.a11ypros.com";

// Define TypeScript Interfaces for WordPress API response
interface WordPressPost {
  id: number;
  slug: string;
  link: string;
}

interface WordPressPage {
  id: number;
  slug: string;
  link: string;
}

async function fetchWordPressPages() {
  try {
    console.log("Fetching WordPress content...");

    const [postsRes, pagesRes] = await Promise.all([
      fetch(`${CMS_URL}/posts?per_page=100`),
      fetch(`${CMS_URL}/pages?per_page=100`),
    ]);

    if (!postsRes.ok || !pagesRes.ok) {
      throw new Error(
        `Failed to fetch: Posts(${postsRes.status}) Pages(${pagesRes.status})`
      );
    }

    const posts: WordPressPost[] = await postsRes.json();
    const pages: WordPressPage[] = await pagesRes.json();

    console.log("Fetched posts:", posts.length);
    console.log("Fetched pages:", pages.length);

    return [
      ...posts.map((post) => `${BASE_URL}/blog/${post.slug}`),
      ...pages.map((page) => `${BASE_URL}/${page.slug}`),
    ];
  } catch (error) {
    console.error("🚨 Error fetching WordPress content:", error);
    return [];
  }
}

export async function GET() {
  console.log("✅ Sitemap API hit");
  const dynamicPages = await fetchWordPressPages();

  if (dynamicPages.length === 0) {
    console.warn("⚠️ No pages retrieved for sitemap.");
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${dynamicPages
        .map(
          (url) => `
          <url>
            <loc>${url}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <priority>${url === BASE_URL ? "1.0" : "0.8"}</priority>
          </url>
        `
        )
        .join("")}
    </urlset>
  `;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
