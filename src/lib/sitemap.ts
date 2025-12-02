const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://a11ypros.com";
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "https://cms.a11ypros.com";

// Define TypeScript Interfaces for WordPress API response
export interface WordPressPost {
  id: number;
  slug: string;
  link: string;
}

export interface WordPressPage {
  id: number;
  slug: string;
  link: string;
  parent: number; // Parent page ID
}

export interface SitemapUrl {
  url: string;
  path: string;
  type: 'page' | 'post' | 'home';
  parentId?: number;
  pageId?: number;
  slug: string;
}

export async function fetchWordPressPages(): Promise<SitemapUrl[]> {
  try {
    const [postsRes, pagesRes] = await Promise.all([
      fetch(`${CMS_URL}/posts?per_page=100`, { cache: 'no-store' }),
      fetch(`${CMS_URL}/pages?per_page=100&_fields=id,slug,parent,link`, { cache: 'no-store' }),
    ]);

    if (!postsRes.ok || !pagesRes.ok) {
      throw new Error(
        `Failed to fetch: Posts(${postsRes.status}) Pages(${pagesRes.status})`
      );
    }

    const posts: WordPressPost[] = await postsRes.json();
    const pages: WordPressPage[] = await pagesRes.json();

    const pageMap = new Map<number, WordPressPage>();
    pages.forEach((page) => pageMap.set(page.id, page));

    function getFullPagePath(page: WordPressPage): string {
      let path = page.slug;
      let currentPage = page;

      while (currentPage.parent && pageMap.has(currentPage.parent)) {
        currentPage = pageMap.get(currentPage.parent)!;
        path = `${currentPage.slug}/${path}`;
      }

      return path;
    }

    // Filter out pages that shouldn't be in the sitemap
    const excludedSlugs = ['contact-us-thank-you', 'thank-you'];
    const filteredPages = pages.filter((page) => 
      !excludedSlugs.some(excluded => page.slug.toLowerCase().includes(excluded))
    );

    const sitemapUrls: SitemapUrl[] = [
      {
        url: BASE_URL,
        path: '/',
        type: 'home',
        slug: ''
      },
      ...filteredPages.map((page) => ({
        url: `${BASE_URL}/${getFullPagePath(page)}`,
        path: `/${getFullPagePath(page)}`,
        type: 'page' as const,
        parentId: page.parent || undefined,
        pageId: page.id,
        slug: page.slug
      })),
      ...posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        path: `/blog/${post.slug}`,
        type: 'post' as const,
        slug: post.slug
      })),
    ];

    return sitemapUrls;
  } catch (error) {
    console.error("🚨 Error fetching WordPress content:", error);
    return [];
  }
}

