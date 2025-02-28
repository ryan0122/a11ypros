"use client";
import he from "he";
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

interface StaticLink {
  id: string;
  slug: string;
  title: string;
}

// Define custom titles
const customTitles: Record<string, string> = {
  "about-us": "Who We Are",
  "services": "Services",
  "contact": "Contact"
};

const predefinedOrder = ["about-us", "services", "articles"];

const staticLinks: StaticLink[] = [
  { id: "blog", slug: "blog", title: "Articles" }
];

export default function TopNav() {
  const [pages, setPages] = useState<(PageWithChildren | StaticLink)[]>([]);
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

  const renderPageLink = (page: PageWithChildren | StaticLink) => {
    const getFullPath = (page: PageWithChildren, parentSlug?: string) => {
      return parentSlug ? `/${parentSlug}/${page.slug}` : `/${page.slug}`;
    };
  
    const pagePath = getFullPath(page as PageWithChildren);
    const isActive = pathname === pagePath;
    const isExpanded = "children" in page && expandedMenuId === page.id;
  
    // Use custom title if available, otherwise default to WordPress title
    const menuTitle =
      customTitles[page.slug] ||
      (typeof page.title === "object" ? page.title.rendered : page.title);
  
    if (page.slug === "home") return null;
  
    return (
      <li key={page.id} className="relative">
        <div className="flex items-center gap-1">
          <Link href={pagePath} className={`${isActive ? "active" : ""}`}>
            {menuTitle}
          </Link>
          {"children" in page && page.children.length > 0 && (
            <button
              type="button"
              className="nav-plus p-1 hover:bg-white rounded-full group"
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
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  className="transition-colors group-hover:stroke-black"
                />
              </svg>
            </button>
          )}
        </div>
        {"children" in page && page.children.length > 0 && isExpanded && (
          <ul className="menu sub-menu absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
            {page.children.map((childPage) => {
              const childPath = getFullPath(childPage, page.slug);
              const childTitle =
                customTitles[childPage.slug] || he.decode(childPage.title.rendered);
              return (
                <li key={childPage.id} className="px-4 py-2">
                  <Link
                    href={childPath}
                    className={`uppercase ${pathname === childPath ? "active" : ""}`}
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
    <nav className="w-1/2 hidden md:block">
      <ul className="flex flex-row justify-between items-center">
        {pages.map(renderPageLink)}
      </ul>
    </nav>
  );
}
