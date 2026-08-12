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
  parentSlug?: string;
}

interface TopNavProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

const customTitles: Record<string, string> = {
  "services": "Services",
  "contact": "Contact",
  "compliance": "Compliance",
  "accessibility-partnerships-for-agencies-dev-teams": "Agency Partnerships",
};

const navStructure: PageWithChildren[] = [
  {
    id: 1,
    menu_order: 1,
    parent: 0,
    slug: "services",
    title: { rendered: "Services" },
    children: [
      { id: 11, menu_order: 1, parent: 1, slug: "wcag-compliance-auditing", title: { rendered: "WCAG Compliance Auditing" }, children: [] },
      { id: 12, menu_order: 2, parent: 1, slug: "vpat-acr-authoring", title: { rendered: "VPAT® / ACR Authoring" }, children: [] },
      { id: 18, menu_order: 3, parent: 1, slug: "figma-design-audits", title: { rendered: "Figma Design Audits" }, children: [] },
      { id: 13, menu_order: 4, parent: 1, slug: "website-remediation", title: { rendered: "Website Remediation" }, children: [] },
      { id: 14, menu_order: 5, parent: 1, slug: "pdf-remediation", title: { rendered: "PDF Remediation" }, children: [] },
      { id: 15, menu_order: 6, parent: 1, slug: "web-accessibility-consulting", title: { rendered: "Web Accessibility Consulting" }, children: [] },
      { id: 16, menu_order: 7, parent: 1, slug: "ada-litigation-support", title: { rendered: "ADA Litigation Support" }, children: [] },
      { id: 17, menu_order: 8, parent: 1, slug: "accessibility-partnerships-for-agencies-dev-teams", title: { rendered: "Agency Partnerships" }, children: [] },
    ],
  },
  {
    id: 2,
    menu_order: 2,
    parent: 0,
    slug: "compliance",
    title: { rendered: "Compliance" },
    children: [
      { id: 21, menu_order: 1, parent: 2, slug: "web-content-accessibility-guidelines", title: { rendered: "WCAG 2.1 / 2.2 AA" }, children: [] },
      { id: 22, menu_order: 2, parent: 2, slug: "the-americans-with-disabilities-act", title: { rendered: "ADA Title III" }, children: [] },
      { id: 23, menu_order: 3, parent: 2, slug: "section-508", title: { rendered: "Section 508" }, children: [] },
      { id: 24, menu_order: 4, parent: 2, slug: "en-301-549", title: { rendered: "EN 301 549" }, children: [] },
      { id: 25, menu_order: 5, parent: 2, slug: "the-accessible-canada-act-aca", title: { rendered: "Accessible Canada Act (ACA)" }, children: [] },
      { id: 26, menu_order: 6, parent: 2, slug: "aoda", title: { rendered: "AODA (Ontario)" }, children: [] },
    ],
  },
  {
    id: 3,
    menu_order: 3,
    parent: 0,
    slug: "about-us",
    title: { rendered: "About Us" },
    children: [
      { id: 31, menu_order: 1, parent: 3, slug: "our-mission", title: { rendered: "Our Mission" }, children: [] },
    ],
  },
];

const staticLinks: StaticLink[] = [
  { id: "pricing", slug: "pricing", title: "Pricing" },
  { id: "blog", slug: "blog", title: "Articles" },
  { id: "contact-us", slug: "contact-us", title: "Contact Us" },
];

export default function TopNav({ isMobile = false, onLinkClick }: TopNavProps) {
  const [pages, setPages] = useState<(PageWithChildren | StaticLink)[]>([]);
  const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Standardize navigation from local static structure (0 network calls)
    const mergedPages: (PageWithChildren | StaticLink)[] = [
      navStructure[0], // Services
      navStructure[1], // Compliance
      staticLinks[0],  // Pricing
      staticLinks[1],  // Articles
      navStructure[2], // About Us
      staticLinks[2],  // Contact Us
    ];
    setPages(mergedPages);
  }, []);

  useEffect(() => {
    setExpandedMenuId(null);
  }, [pathname]);

  const toggleMenu = (pageId: number) => {
    setExpandedMenuId((prevId) => (prevId === pageId ? null : pageId));
  };

  const handleLinkClick = () => {
    setExpandedMenuId(null);
    if (onLinkClick) {
      onLinkClick();
    }
  };

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
    const submenuId = `submenu-${page.slug}`;
    const isContactPage = page.slug === 'contact-us';
    const contactSpecialClasses = isContactPage ? 'contact-link' : '';

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
            aria-current={isPageActive ? "page" : undefined}
            onClick={handleLinkClick}
          >
            {typeof menuTitle === 'string' ? menuTitle : he.decode(menuTitle)}
          </Link>
          {"children" in page && page.children.length > 0 && (
            <button
              type="button"
              className={`nav-plus p-1 hover:bg-[#d4e300] focus:bg-[#d4e300] rounded-full ml-2 ${hasActiveChild ? "child-menu-active" : ""}`}
              aria-expanded={isExpanded}
              aria-controls={submenuId}
              aria-label={`${menuTitle} submenu`}
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
          <ul
            id={submenuId}
            className={`menu sub-menu ${isMobile
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
                    aria-current={isChildActive ? "page" : undefined}
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
    <nav
      aria-label={isMobile ? "Mobile navigation" : "Main navigation"}
      className={isMobile ? "w-full block" : "w-full hidden md:block"}
    >
      <ul className={isMobile
        ? "flex flex-col space-y-1"
        : "flex flex-row justify-between items-center gap-8"
      }>
        {pages.map(renderPageLink)}
      </ul>
    </nav>
  );
}