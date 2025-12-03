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
    segments.forEach((segment, index) => {
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

  useEffect(() => {
    async function fetchBreadcrumbs() {
      try {
        const fullUrl = `https://cms.a11ypros.com${pathname}`;
        const seoUrl = `${process.env.NEXT_PUBLIC_SEO_URL}${fullUrl}`;
        
        if (!process.env.NEXT_PUBLIC_SEO_URL) {
          console.warn('NEXT_PUBLIC_SEO_URL is not defined, using fallback breadcrumbs');
          setBreadcrumbs(generateBreadcrumbsFromPath(pathname));
          return;
        }

        const res = await fetch(seoUrl);
        
        if (!res.ok) {
          console.warn(`Breadcrumb API returned ${res.status} for ${fullUrl}, using fallback`);
          setBreadcrumbs(generateBreadcrumbsFromPath(pathname));
          return;
        }

        const data = await res.json();
        
        if (!data || !data.head) {
          console.warn(`No head data returned for ${fullUrl}, using fallback`);
          setBreadcrumbs(generateBreadcrumbsFromPath(pathname));
          return;
        }

        // Use regex to extract the LD+JSON script block
        const matches = data.head.match(
			/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
		  );
  
		  if (!matches || matches.length === 0) {
			console.warn(`No JSON-LD scripts found for ${fullUrl}, using fallback`);
			setBreadcrumbs(generateBreadcrumbsFromPath(pathname));
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
					  setBreadcrumbs(items);
					  return; // Successfully found breadcrumbs, exit early
					}
				}
			} catch (err) {
			  console.warn('Failed to parse Rank Math LD+JSON:', err);
			}
		  }
		  
		  // If we get here, no breadcrumbs were found in JSON-LD, use fallback
		  setBreadcrumbs(generateBreadcrumbsFromPath(pathname));
		} catch (err) {
		  console.error('Breadcrumb fetch error:', err);
		  setBreadcrumbs(generateBreadcrumbsFromPath(pathname));
		}
    }

    fetchBreadcrumbs();
  }, [pathname]);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol className="flex space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <li key={index}>
            {index < breadcrumbs.length - 1 ? (
              <a href={crumb.url}>
                {he.decode(crumb.name)}
              </a>
            ) : (
              <span aria-current="page">
                {he.decode(crumb.name)}
              </span>
            )}
            {index < breadcrumbs.length - 1 && <span className="mx-1">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}