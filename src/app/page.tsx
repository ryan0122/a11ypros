import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HomeTemplate from "@/components/HomeTemplate";
import { getPageData, getPageMetaData } from "@/app/api/pages/dataApi";


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

  return {
    title: page.title.rendered,
    description: seoData?.description || "A11Y Pros provides trusted accessibility services.",
    openGraph: {
      title: page.title.rendered,
      description: seoData?.description,
      url: process.env.NEXT_PUBLIC_URL,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title.rendered,
      description: seoData?.description,
    },
  };
}

export default async function HomePage() {
  const page = await getPageData("home"); // Get WordPress "Home" page content

  if (!page) {
    console.warn("⚠️ Home page not found");
    notFound();
  }

  return <HomeTemplate title={page.title.rendered} content={page.content.rendered} />;
}