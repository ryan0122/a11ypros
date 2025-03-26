"use client";
import he from "he";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Page {
  id: number;
  menu_order: number;
  parent: number;
  slug: string;
  title: { rendered: string };
}

interface PageWithChildren extends Page {
  children: PageWithChildren[];
}

interface StaticLink {
  id: string;
  slug: string;
  title: string;
}

interface TopNavProps {
  isMobile?: boolean;
  onLinkClick?: () => void; // Add this prop to handle menu closing
}

// Define custom titles
const customTitles: Record<string, string> = {
  "services": "Services",
  "contact": "Contact",
  "compliance": "Compliance",
};

const predefinedOrder = ["about-us", "services", "compliance", "articles"];

const staticLinks: StaticLink[] = [
  { id: "blog", slug: "blog", title: "Articles" }
];

export default function TopNav({ isMobile = false, onLinkClick }: TopNavProps) {
  const [pages, setPages] = useState<(PageWithChildren | StaticLink)[]>([]);
  const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchPages() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/pages?per_page=100`);
      if (res.ok) {
        const data: Page[] = await res.json();
        const excludedPages = ["privacy-policy", "accessibility-statement", "contact-us-thank-you", "blog"];
        
        const pagesWithChildren: PageWithChildren[] = data
          .filter(page => page.parent === 0 && !excludedPages.includes(page.slug))
          .map(page => ({
            ...page,
            children: data
              .filter(childPage => childPage.parent === page.id)
              .sort((a, b) => a.menu_order - b.menu_order) // Sort child pages
              .map(childPage => ({
                ...childPage,
                children: []
              }))
          }));

        const mergedPages: (PageWithChildren | StaticLink)[] = [...staticLinks, ...pagesWithChildren];

        const sortedPages = mergedPages.sort((a, b) => {
          const indexA = predefinedOrder.indexOf(a.slug);
          const indexB = predefinedOrder.indexOf(b.slug);
          return (indexA === -1 ? predefinedOrder.length : indexA) - (indexB === -1 ? predefinedOrder.length : indexB);
        });

        setPages(sortedPages);
      }
    }
    fetchPages();
  }, []);

  useEffect(() => {
    setExpandedMenuId(null);
  }, [pathname]);

  const toggleMenu = (pageId: number) => {
    setExpandedMenuId((prevId) => (prevId === pageId ? null : pageId));
  };

  // Handle link clicks to close menu if needed
  const handleLinkClick = () => {
    // Close any expanded menus
    setExpandedMenuId(null);
    
    // Call the onLinkClick callback if provided
    if (onLinkClick) {
      onLinkClick();
    }
  };

  // Check if any child page is active
  const isChildActive = (page: PageWithChildren) => {
    if (!("children" in page)) return false;
    
    return page.children.some(childPage => {
      const childPath = `/${page.slug}/${childPage.slug}`;
      return pathname === childPath;
    });
  };

  const renderPageLink = (page: PageWithChildren | StaticLink) => {
    const getFullPath = (page: PageWithChildren, parentSlug?: string) => {
      return parentSlug ? `/${parentSlug}/${page.slug}` : `/${page.slug}`;
    };
  
    const pagePath = 'slug' in page ? `/${page.slug}` : '/';
    const isPageActive = pathname === pagePath;
    const hasActiveChild = "children" in page && isChildActive(page);
    const isExpanded = "children" in page && expandedMenuId === page.id;
    const isContactPage = page.slug === 'contact-us';
    const contactSpecialClasses = isContactPage 
      ? 'contact-link' 
      : '';
  
    // Use custom title if available, otherwise default to WordPress title
    const menuTitle =
      customTitles[page.slug] ||
      (typeof page.title === "object" ? page.title.rendered : page.title);
  
    if (page.slug === "home") return null;
  
    return (
      <li key={page.id} className={`relative ${isMobile ? 'py-3' : ''}`}>
        <div className={`flex items-center ${isMobile ? 'justify-between' : ''}`}>
          <Link 
            href={pagePath} 
            className={`${isPageActive ? "active" : ""} ${hasActiveChild ? "parent-active" : ""} ${isMobile ? 'text-lg font-medium' : ''} ${contactSpecialClasses}`}
            onClick={handleLinkClick}
          >
            {typeof menuTitle === 'string' ? menuTitle : he.decode(menuTitle)}
          </Link>
          {"children" in page && page.children.length > 0 && (
            <button
              type="button"
              className={`nav-plus p-1 hover:bg-[#d4e300] focus:bg-[#d4e300] rounded-full ml-2 ${hasActiveChild ? "child-menu-active" : ""}`}
              aria-expanded={isExpanded}
              aria-label={`${menuTitle} sub menu`}
              onClick={() => toggleMenu(page.id)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <path
                  d="M2 5L8 11L14 5"
                  stroke={isMobile ? "black" : "white"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </button>
          )}
        </div>
        {"children" in page && page.children.length > 0 && isExpanded && (
          <ul className={`menu sub-menu ${isMobile 
            ? 'mt-2 ml-4 border-l-2 border-gray-200 pl-4' 
            : 'absolute left-0 mt-2 min-w-80 bg-white shadow-lg rounded-md py-2'}`}
          >
            {page.children.map((childPage) => {
              const childPath = getFullPath(childPage, page.slug);
              const childTitle =
                customTitles[childPage.slug] || he.decode(childPage.title.rendered);
              const isChildActive = pathname === childPath;
              
              return (
                <li key={childPage.id} className={isMobile ? "py-2" : "px-4 py-2"}>
                  <Link
                    href={childPath}
                    className={`${isMobile ? '' : 'uppercase'} ${isChildActive ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    {childTitle}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };
  
  return (
    <nav className={isMobile ? "w-full block" : "w-full hidden md:block"}>
      <ul className={isMobile 
        ? "flex flex-col space-y-1" 
        : "flex flex-row justify-between items-center gap-16"
      }>
        {pages.map(renderPageLink)}
      </ul>
    </nav>
  );
}