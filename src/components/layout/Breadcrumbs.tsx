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
    const fallbackItems = generateBreadcrumbsFromPath(pathname);
    setBreadcrumbs(ensureBlogParent(fallbackItems, pathname));
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
              {!isLast && <span className="mx-1" aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}