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

  useEffect(() => {
    async function fetchBreadcrumbs() {
      try {
        const fullUrl = `https://cms.a11ypros.com/${pathname}`;
        const res = await fetch(`${process.env.NEXT_PUBLIC_SEO_URL}${fullUrl}`);
        const data = await res.json();
        // Use regex to extract the LD+JSON script block
        const matches = data.head.match(
			/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs
		  );
  
		  if (matches) {
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
  
				const items = breadcrumbList?.itemListElement?.map((el: { item: { name: string; '@id': string } }) => ({
					name: el.item.name,
					url: el.item['@id'],
				  }));
  
				if (items?.length) {
				  setBreadcrumbs(items);
				}
			  } catch (err) {
				console.warn('Failed to parse Rank Math LD+JSON:', err);
			  }
			}
		  }
		} catch (err) {
		  console.error('Breadcrumb fetch error:', err);
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