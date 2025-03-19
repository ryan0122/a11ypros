import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HomeTemplate from "@/components/HomeTemplate";
import { getPageData, getPageMetaData } from "@/lib/api/pages/dataApi";
import he from "he";


export async function generateMetadata(): Promise<Metadata> {
  const [page, seoData] = await Promise.all([
    getPageData("home"), // Fetch the WordPress "Home" page content
    getPageMetaData("home"), // Fetch SEO metadata
  ]);

  if (!page) {
    return {
      title: "Page Not Found - A11Y Pros",
      description: "The page you are looking for does not exist.",
    };
  }

   // Decode HTML entities in the title
   const decodedTitle = he.decode(page.title.rendered);

   // Define the canonical URL (Ensure `NEXT_PUBLIC_URL` is set correctly)
  const canonicalUrl = `${process.env.NEXT_PUBLIC_URL || "https://a11ypros.com"}/`;

  return {
    title: `${decodedTitle} - A11Y Pros`,
    description: seoData?.description || "A11Y Pros provides trusted accessibility services.",
    openGraph: {
      title: `${decodedTitle} - A11Y Pros`,
      description: seoData?.description,
      url: process.env.NEXT_PUBLIC_URL,
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedTitle} - A11Y Pros`,
      description: seoData?.description,
    },
    alternates: {
      canonical: canonicalUrl, 
    },
    other: {
      "google-site-verification": "zXaNJtIUuGJQnnRMA6KHOYuCMgK0IP-E8Q_XbfTJ7hs",
    },
  };
}

export default async function HomePage() {
  const [page, seoData] = await Promise.all([
    getPageData('home'),
    getPageMetaData('home'),
  ]);

  if (!page) {
    console.warn("⚠️ Home page not found");
    notFound();
  }

  return (
    <>
     {/* ✅ Inject JSON-LD Schema from RankMath */}
     {seoData?.rankMathSchema && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: seoData.rankMathSchema }}
      />
    )}
     <HomeTemplate title={page.title.rendered} content={page.content.rendered} />
     </>
  );
}