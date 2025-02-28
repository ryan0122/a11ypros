import { notFound } from "next/navigation";
import PageTemplate from "@/components/PageTemplate";
import type { Metadata } from "next";
import { getPageData, getPageMetaData } from "@/lib/api/pages/dataApi";

// Keep both params and searchParams in the type to match Next.js expectations
// type PageProps = {
//   params: Promise<{ slug: string }>;
//   searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
// };


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
      url: `${process.env.NEXT_PUBLIC_URL}/${page.parentSlug ? `${page.parentSlug}/` : ''}${page.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title.rendered,
      description: seoData?.description,
    },
  };
}

type PageProps = {
  params: Promise<{ slug: string[] }>; // Await this
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 🛠 Render Page
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params; // ✅ Await params before using

  if (!resolvedParams?.slug) {
    console.error("❌ ERROR: Missing slug param");
    notFound();
  }

  console.log("Slug Array from Next.js params:", resolvedParams?.slug);

  const slugArray = resolvedParams.slug[0] === "pages" ? resolvedParams.slug.slice(1) : resolvedParams.slug;
  const slug = slugArray[slugArray.length - 1];

  // 🔍 Fetch page data using the last slug (child page)
  const page = await getPageData(slug);
  if (!page) {
    console.warn("⚠️ No page found for:", slug);
    notFound();
  }

  console.log("Fetched Page Data:", page);

   // Ensure parent-child relationship is correct
   const expectedPath = page.parentSlug ? [page.parentSlug, page.slug] : [page.slug];

   console.log(page.parentSlug);
  

   if (JSON.stringify(slugArray) !== JSON.stringify(expectedPath)) {
     console.error(
       `❌ ERROR: Mismatch in URL structure. Expected: /${expectedPath.join("/")}, Got: /${slugArray.join("/")}`
     );
     notFound();
   }
 
   return <PageTemplate title={page.title.rendered} content={page.content.rendered} />;
}