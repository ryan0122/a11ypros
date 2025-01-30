"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Page {
  id: number;
  slug: string;
  title: { rendered: string };
  parent: number;
}

interface PageWithChildren extends Page {
  children: PageWithChildren[];
}

export default function TopNav() {
  const [pages, setPages] = useState<PageWithChildren[]>([]);
  const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchPages() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/pages?per_page=100`);
      if (res.ok) {
        const data: Page[] = await res.json();
        
        const pagesWithChildren: PageWithChildren[] = data
          .filter(page => page.parent === 0)
          .map(page => ({
            ...page,
            children: data
              .filter(childPage => childPage.parent === page.id)
              .map(childPage => ({
                ...childPage,
                children: []
              }))
          }));

        setPages(pagesWithChildren);
      }
    }
    fetchPages();
  }, []);

  // Close menu when pathname changes (page navigation)
  useEffect(() => {
    setExpandedMenuId(null);
  }, [pathname]);

  const toggleMenu = (pageId: number) => {
    // If clicking the same menu, close it
    // If clicking a different menu, close the previous and open the new one
    setExpandedMenuId(prevId => prevId === pageId ? null : pageId);
  };

  const renderPageLink = (page: PageWithChildren) => {
    const isActive = pathname === `/pages/${page.slug}`;
    const isExpanded = expandedMenuId === page.id;
    
    return (
      <li key={page.id} className="relative">
        <div className="flex items-center gap-1">
          <Link 
            href={`/pages/${page.slug}`}
            className={isActive ? "active" : ""}
          >
            {page.title.rendered}
          </Link>
          
          {page.children.length > 0 && (
            <button
              type="button"
              className="nav-plus p-1 hover:bg-gray-100 rounded-full"
              aria-expanded={isExpanded}
              aria-label={`${page.title.rendered} sub menu`}
              onClick={() => toggleMenu(page.id)}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <path 
                  d="M2 5L8 11L14 5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="none"
                />
              </svg>
            </button>
          )}
        </div>
        
        {page.children.length > 0 && isExpanded && (
          <ul className="menu sub-menu absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
            {page.children.map(childPage => (
              <li key={childPage.id} className="px-4 py-2 hover:bg-gray-100">
                <Link 
                  href={`/pages/${childPage.slug}`}
                  className={`text-black ${pathname === `/pages/${childPage.slug}` ? "active" : ""}`}
                >
                  {childPage.title.rendered}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav>
      <ul className="flex flex-row gap-6">
        <li className={pathname === "/" ? "active" : ""}>
          <Link href="/">Home</Link>
        </li>
        {pages.map(renderPageLink)}
      </ul>
    </nav>
  );
}