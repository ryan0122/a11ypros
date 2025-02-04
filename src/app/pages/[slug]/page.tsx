import { notFound } from "next/navigation";
import PageTemplate from "@/components/PageTemplate";
import type { Metadata } from "next";

// Keep both params and searchParams in the type to match Next.js expectations
type PageProps = {
  params: Promise<{ slug: string }>;  // ✅ Fix: Mark it as a Promise
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};


// 🛠 Fetch Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [page, seoData] = await Promise.all([
    getPageData(params.slug),
    getPageMetaData(params.slug),
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
      url: `${process.env.NEXT_PUBLIC_URL}/${page.slug}`,
      // images: seoData?.og_image ? [{ url: seoData.og_image }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:  page.title.rendered,
      description: seoData?.description,
      // images: seoData?.twitter_image ? [{ url: seoData.twitter_image }] : [],
    },
  };
}

// 🛠 Fetch metadata from the separate SEO API
async function getPageMetaData(slug: string) {
  if (!process.env.NEXT_PUBLIC_SEO_URL) {
    console.error("❌ ERROR: `NEXT_PUBLIC_SEO_URL` is not defined in `.env.local`");
    return null;
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_SEO_URL}${process.env.NEXT_PUBLIC_URL}${slug}`;

  try {
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      console.error(`❌ ERROR: Failed to fetch SEO data (Status ${res.status})`);
      return null;
    }

    const seoData = await res.json();
    console.log("✅ SEO API Response:", seoData);


    const descriptionMatch = seoData.head.match(
      /<meta\s+name=["']description["']\s+content=["']([^"']+)["']\s*\/?>/
    );

    const seoFormattedData = {description: descriptionMatch ? descriptionMatch[1] : ''}; 

    return seoFormattedData;
  } catch (error) {
    console.error("❌ ERROR: Fetch request to SEO API failed", error);
    return null;
  }
}

async function getPageData(slug: string) {
  if (!process.env.NEXT_PUBLIC_CMS_URL) {
    console.error("❌ ERROR: `NEXT_PUBLIC_CMS_URL` is not defined in `.env.local`");
    return null;
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_CMS_URL}/pages?slug=${slug}&_fields=id,slug,title,content`;

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Authorization: `${process.env.NEXT_PUBLIC_WP_AUTH}`,
      },
    });

    if (!res.ok) {
      console.error(`❌ ERROR: Failed to fetch page data (Status ${res.status})`);
      return null;
    }

    const pages = await res.json();
    console.log("✅ WordPress API Response:", pages);

    return pages.length > 0 ? pages[0] : null;
  } catch (error) {
    console.error("❌ ERROR: Fetch request to WordPress API failed", error);
    return null;
  }
}

// 🛠 Render Page
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params; // ✅ Await params

  if (!resolvedParams || typeof resolvedParams.slug !== "string") {
    console.error("❌ ERROR: Invalid params object", resolvedParams);
    notFound();
  }

  const page = await getPageData(resolvedParams.slug);

  if (!page) {
    console.warn("⚠️ No page found for:", resolvedParams.slug);
    notFound();
  }

  return <PageTemplate title={page.title.rendered} content={page.content.rendered} />;
}
