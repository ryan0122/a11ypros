'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import he from 'he'

interface BreadcrumbItem {
  name: string;
  url: string;
}

export default function Breadcrumbs() {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const pathname = usePathname();

  // Fallback: Generate breadcrumbs from pathname structure
  function generateBreadcrumbsFromPath(path: string): BreadcrumbItem[] {
    if (path === '/') return [];
    
    const segments = path.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [
      { name: 'Home', url: '/' }
    ];

    let currentPath = '';
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      // Convert slug to readable name (capitalize and replace hyphens)
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      items.push({
        name,
        url: currentPath
      });
    });

    return items;
  }

  // Ensure blog posts always have /blog parent in breadcrumbs
  function ensureBlogParent(items: BreadcrumbItem[], pathname: string): BreadcrumbItem[] {
    // Check if we're on a blog post page (starts with /blog/ and has a slug)
    if (pathname.startsWith('/blog/') && pathname !== '/blog') {
      // Normalize URLs for comparison (handle both relative and absolute URLs)
      const normalizeUrl = (url: string): string => {
        if (url.startsWith('http')) {
          // Extract pathname from absolute URL
          try {
            const urlObj = new URL(url);
            return urlObj.pathname;
          } catch {
            return url;
          }
        }
        return url;
      };
      
      // Remove any post title items (items that match the current pathname)
      const postSlug = pathname.split('/blog/')[1];
      items = items.filter(item => {
        const normalized = normalizeUrl(item.url);
        // Remove items that match the current post pathname
        return normalized !== pathname && !normalized.endsWith(postSlug);
      });
      
      // Check if /blog is already in the breadcrumbs
      const blogIndex = items.findIndex((item) => {
        const normalized = normalizeUrl(item.url);
        return normalized === '/blog';
      });
      
      if (blogIndex < 0) {
        // /blog doesn't exist, so we need to add it
        // Find where to insert /blog (should be after Home)
        const homeIndex = items.findIndex(item => {
          const normalized = normalizeUrl(item.url);
          return normalized === '/';
        });
        
        if (homeIndex >= 0) {
          // Insert Articles breadcrumb after Home
          const blogItem: BreadcrumbItem = {
            name: 'Articles',
            url: '/blog'
          };
          items.splice(homeIndex + 1, 0, blogItem);
        } else {
          // If no Home found, prepend both Home and Articles
          items.unshift(
            { name: 'Home', url: '/' },
            { name: 'Articles', url: '/blog' }
          );
        }
      } else {
        // /blog exists, but update its name to "Articles" if needed
        if (items[blogIndex].name !== 'Articles') {
          items[blogIndex].name = 'Articles';
        }
      }
    }
    
    return items;
  }

  useEffect(() => {
    async function fetchBreadcrumbs() {
      try {
        const fullUrl = `https://cms.a11ypros.com${pathname}`;
        const seoUrl = `${process.env.NEXT_PUBLIC_SEO_URL}${fullUrl}`;
        
        if (!process.env.NEXT_PUBLIC_SEO_URL) {
          console.warn('NEXT_PUBLIC_SEO_URL is not defined, using fallback breadcrumbs');
          const fallbackItems = generateBreadcrumbsFromPath(pathname);
          setBreadcrumbs(ensureBlogParent(fallbackItems, pathname));
          return;
        }

        const res = await fetch(seoUrl);
        
        if (!res.ok) {
          console.warn(`Breadcrumb API returned ${res.status} for ${fullUrl}, using fallback`);
          const fallbackItems = generateBreadcrumbsFromPath(pathname);
          setBreadcrumbs(ensureBlogParent(fallbackItems, pathname));
          return;
        }

        const data = await res.json();
        
        if (!data || !data.head) {
          console.warn(`No head data returned for ${fullUrl}, using fallback`);
          const fallbackItems = generateBreadcrumbsFromPath(pathname);
          setBreadcrumbs(ensureBlogParent(fallbackItems, pathname));
          return;
        }

        // Use regex to extract the LD+JSON script block
        const matches = data.head.match(
			/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
		  );
  
		  if (!matches || matches.length === 0) {
			console.warn(`No JSON-LD scripts found for ${fullUrl}, using fallback`);
			const fallbackItems = generateBreadcrumbsFromPath(pathname);
			setBreadcrumbs(ensureBlogParent(fallbackItems, pathname));
			return;
		  }

		  for (const match of matches) {
			try {
				const jsonStr = match
				  .replace(/<script[^>]*type="application\/ld\+json"[^>]*>/, '')
				  .replace('</script>', '')
				  .replace(/\\x3C/g, '<'); // decode escaped HTML if needed
  
				const jsonData = JSON.parse(jsonStr);
  
				// Look for BreadcrumbList in @graph
				const breadcrumbList = jsonData['@graph']?.find(
				  (item: Record<string, unknown>) => item['@type'] === 'BreadcrumbList'
				);
  
				if (breadcrumbList && breadcrumbList.itemListElement) {
					const items = breadcrumbList.itemListElement.map((el: { item: { name: string; '@id': string } }) => ({
						name: el.item.name,
						url: el.item['@id'],
					}));
  
					if (items?.length) {
					  // Ensure blog posts have /blog parent
					  const normalizedItems = ensureBlogParent(items, pathname);
					  setBreadcrumbs(normalizedItems);
					  return; // Successfully found breadcrumbs, exit early
					}
				}
			} catch (err) {
			  console.warn('Failed to parse Rank Math LD+JSON:', err);
			}
		  }
		  
		  // If we get here, no breadcrumbs were found in JSON-LD, use fallback
		  const fallbackItems = generateBreadcrumbsFromPath(pathname);
		  setBreadcrumbs(ensureBlogParent(fallbackItems, pathname));
		} catch (err) {
		  console.error('Breadcrumb fetch error:', err);
		  const fallbackItems = generateBreadcrumbsFromPath(pathname);
		  setBreadcrumbs(ensureBlogParent(fallbackItems, pathname));
		}
    }

    fetchBreadcrumbs();
  }, [pathname]);

  if (breadcrumbs.length === 0) return null;

  // Normalize URL for comparison
  const normalizeUrl = (url: string): string => {
    if (url.startsWith('http')) {
      try {
        const urlObj = new URL(url);
        return urlObj.pathname;
      } catch {
        return url;
      }
    }
    return url;
  };

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol className="flex space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const crumbPath = normalizeUrl(crumb.url);
          const currentPath = pathname;
          // Only mark as current page if the URL exactly matches the current pathname
          const isCurrentPage = crumbPath === currentPath;
          
          return (
            <li key={index}>
              {isCurrentPage ? (
                <span aria-current="page">
                  {he.decode(crumb.name)}
                </span>
              ) : (
                <a href={crumb.url}>
                  {he.decode(crumb.name)}
                </a>
              )}
              {!isLast && <span className="mx-1">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}