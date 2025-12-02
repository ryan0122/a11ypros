import Link from 'next/link';
import { fetchWordPressPages } from '@/lib/sitemap';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sitemap | A11y Pros',
  description: 'Complete sitemap of all pages and blog posts on A11y Pros',
};

function formatTitle(path: string): string {
  // Remove leading slash and replace slashes with spaces
  let title = path.replace(/^\//, '').replace(/\//g, ' ');
  // Replace hyphens with spaces
  title = title.replace(/-/g, ' ');
  // Remove 'blog' prefix if present
  title = title.replace(/^blog\s+/i, '');
  // Capitalize each word
  title = title
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  return title || 'Home';
}

function formatSlugTitle(slug: string): string {
  // Replace hyphens with spaces
  let title = slug.replace(/-/g, ' ');
  // Capitalize each word
  title = title
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  return title;
}

interface PageNode {
  url: string;
  path: string;
  title: string;
  pageId?: number;
  children: PageNode[];
}

function buildPageHierarchy(pages: Array<{ url: string; path: string; parentId?: number; pageId?: number; slug: string }>): PageNode[] {
  const pageMap = new Map<number, PageNode>();
  const rootPages: PageNode[] = [];

  // First pass: create all nodes
  pages.forEach((page) => {
    const node: PageNode = {
      url: page.url,
      path: page.path,
      title: formatSlugTitle(page.slug),
      pageId: page.pageId,
      children: []
    };
    if (page.pageId) {
      pageMap.set(page.pageId, node);
    }
  });

  // Second pass: build hierarchy
  pages.forEach((page) => {
    if (!page.pageId) return;
    
    const node = pageMap.get(page.pageId)!;
    if (page.parentId && pageMap.has(page.parentId)) {
      const parent = pageMap.get(page.parentId)!;
      parent.children.push(node);
    } else {
      rootPages.push(node);
    }
  });

  // Sort each level alphabetically
  function sortNodes(nodes: PageNode[]): PageNode[] {
    return nodes.sort((a, b) => a.title.localeCompare(b.title)).map(node => ({
      ...node,
      children: sortNodes(node.children)
    }));
  }

  return sortNodes(rootPages);
}

function PageTree({ pages }: { pages: PageNode[] }) {
  if (pages.length === 0) return null;

  return (
    <ul className="space-y-2">
      {pages.map((page) => (
        <li key={page.url} className="mb-2">
          <Link 
            href={page.path}
            className="text-[#0E8168] hover:text-[#0a6b57] hover:underline"
          >
            {page.title}
          </Link>
          {page.children.length > 0 && (
            <div className="ml-6 mt-2">
              <PageTree pages={page.children} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function SitemapPage() {
  const urls = await fetchWordPressPages();

  // Group URLs by type
  const homePage = urls.find((url) => url.type === 'home');
  const pages = urls.filter((url) => url.type === 'page');
  const posts = urls.filter((url) => url.type === 'post').sort((a, b) => b.path.localeCompare(a.path));
  
  // Build hierarchical structure for pages
  const pageHierarchy = buildPageHierarchy(pages);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <h1 className="text-4xl font-bold mb-8 text-[#001d2f]">Sitemap</h1>
        <p className="text-lg text-gray-700 mb-12">
          Find all pages and blog posts on our website. Use this sitemap to navigate our content.
        </p>

        <div className="space-y-12">
          {/* Home Page */}
          {homePage && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#001d2f]">Home</h2>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href={homePage.path}
                    className="text-[#0E8168] hover:text-[#0a6b57] hover:underline"
                  >
                    {homePage.url}
                  </Link>
                </li>
              </ul>
            </section>
          )}

          {/* Pages */}
          {pageHierarchy.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#001d2f]">Pages</h2>
              <PageTree pages={pageHierarchy} />
            </section>
          )}

          {/* Blog Posts */}
          {posts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#001d2f]">Blog Posts</h2>
              <ul className="space-y-2 columns-1 md:columns-2 lg:columns-3 gap-4">
                {posts.map((item) => (
                  <li key={item.url} className="break-inside-avoid mb-2">
                    <Link 
                      href={item.path}
                      className="text-[#0E8168] hover:text-[#0a6b57] hover:underline"
                    >
                      {formatTitle(item.path)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </main>
  );
}

