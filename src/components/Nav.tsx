"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Page {
  id: number;
  slug: string;
  title: { rendered: string };
}

export default function Nav() {
  const [pages, setPages] = useState<Page[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchPages() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/pages`);
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    }
    fetchPages();
  }, []);

  return (
    <nav>
      <ul className="flex flex-row gap-6">
	  <li className={pathname === "/" ? "active" : ""}>
          <Link href="/">Home</Link>
        </li>
        {pages.map((page) => (
          <li key={page.id} className={pathname === `/pages/${page.slug}` ? "active" : ""}>
            <Link href={`/pages/${page.slug}`}>{page.title.rendered}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
