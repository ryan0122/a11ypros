import { notFound } from "next/navigation";
import PageTemplate from "@/components/PageTemplate";
import type { Metadata } from "next";
import { getPageData, getPageMetaData } from "@/lib/api/pages/dataApi";
import he from "he";

type PageProps = {
  params: Promise<{ slug: string[] }>; // Await this
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 🛠 Fetch Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;

  if (!resolvedParams || !Array.isArray(resolvedParams.slug) || resolvedParams.slug.length === 0) {
    return {
      title: "Page Not Found - A11Y Pros",
      description: "The page you are looking for does not exist.",
    };
  }

  const [parentSlug, childSlug] = resolvedParams.slug;
  const fullSlug = childSlug ? `${parentSlug}/${childSlug}` : parentSlug;

  const [page, seoData] = await Promise.all([
    getPageData(childSlug),
    getPageMetaData(fullSlug),
  ]);

  if (!page) {
    return {
      title: "Page Not Found - A11Y Pros",
      description: "The page you are looking for does not exist.",
    };
  }

  const decodedTitle = he.decode(page.title.rendered);

  return {
    title: `${decodedTitle} - A11Y Pros`,
    description: seoData?.description || "A11Y Pros provides trusted accessibility services.",
    openGraph: {
      title: `${decodedTitle} - A11Y Pros`,
      description: seoData?.description,
      url: `${process.env.NEXT_PUBLIC_URL}/${fullSlug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedTitle} - A11Y Pros`,
      description: seoData?.description,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL}/${fullSlug}`,
    },
  };
}

// 🛠 Render Page
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  if (!resolvedParams?.slug) {
    console.error("❌ ERROR: Missing slug param");
    notFound();
  }

  if (resolvedParams?.slug?.join("/") === "sitemap.xml") {
    return notFound();
  }

  console.log("Slug Array from Next.js params:", resolvedParams?.slug);

  const slugArray = resolvedParams.slug[0] === "pages" ? resolvedParams.slug.slice(1) : resolvedParams.slug;
  const slug = slugArray[slugArray.length - 1];

  const [page, seoData] = await Promise.all([
    getPageData(slug),
    getPageMetaData(slug),
  ]);

  if (!page) {
    console.warn("⚠️ No page found for:", slug);
    notFound();
  }

  console.log("Fetched Page Data:", page);

  const expectedPath = page.parentSlug ? [page.parentSlug, page.slug] : [page.slug];

  if (JSON.stringify(slugArray) !== JSON.stringify(expectedPath)) {
    console.error(
      `❌ ERROR: Mismatch in URL structure. Expected: /${expectedPath.join("/")}, Got: /${slugArray.join("/")}`
    );
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

      {/* ✅ Render Page Content */}
      <PageTemplate
        slug={page.slug}
        title={page.title.rendered}
        content={page.content.rendered}
        featuredImage={page.featuredImage}
      />
    </>
  );
}
