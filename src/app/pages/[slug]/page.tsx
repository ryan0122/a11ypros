import { notFound } from "next/navigation";
import PageTemplate from "@/components/PageTemplate";
import type { Metadata } from "next";
import { getPageData, getPageMetaData } from "@/app/api/pages/dataApi";

// Keep both params and searchParams in the type to match Next.js expectations
type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};


// 🛠 Fetch Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params; // Ensure it's fully resolved before using

  if (!resolvedParams || typeof resolvedParams.slug !== "string") {
    return {
      title: "Page Not Found - A11Y Pros",
      description: "The page you are looking for does not exist.",
    };
  }

  const [page, seoData] = await Promise.all([
    getPageData(resolvedParams.slug),
    getPageMetaData(resolvedParams.slug),
  ]);

  if (!page) {
    return {
      title: "Page Not Found - A11Y Pros",
      description: "The page you are looking for does not exist.",
    };
  }

  return {
    title: `${page.title.rendered} - A11Y Pros`,
    description: seoData?.description || "A11Y Pros provides trusted accessibility services.",
    openGraph: {
      title: page.title.rendered,
      description: seoData?.description,
      url: `${process.env.NEXT_PUBLIC_URL}/${page.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title.rendered,
      description: seoData?.description,
    },
  };
}

// 🛠 Render Page
export default async function Page({ params }: PageProps) {
  
  const resolvedParams = await params; // ✅ Await params

  if (!resolvedParams || typeof resolvedParams.slug !== "string") {
    console.error("❌ ERROR: Invalid params object", resolvedParams);
    notFound();
  }

  if (resolvedParams.slug === "home") {
    notFound(); // Prevents conflicts with the homepage
  }

  const page = await getPageData(resolvedParams.slug);

  if (!page) {
    console.warn("⚠️ No page found for:", resolvedParams.slug);
    notFound();
  }

  return <PageTemplate title={page.title.rendered} content={page.content.rendered} />;
}
