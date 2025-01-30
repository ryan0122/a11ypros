import { notFound } from "next/navigation";
import PageTemplate from "@/components/PageTemplate";

// Update both params and searchParams to be Promises
type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getPageData(slug: string) {
  if (!process.env.CMS_URL) {
    console.error("❌ ERROR: `CMS_URL` is not defined in `.env.local`");
    return null;
  }

  const apiUrl = `${process.env.CMS_URL}/pages?slug=${slug}`;

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Authorization: `${process.env.WP_AUTH}`,
      },
    });

    if (!res.ok) {
      console.error(`❌ ERROR: Failed to fetch page (Status ${res.status})`);
      return null;
    }

    const pages = await res.json();
    console.log("✅ API Response:", pages);

    return pages.length > 0 ? pages[0] : null;
  } catch (error) {
    console.error("❌ ERROR: Fetch request failed", error);
    return null;
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  console.log("📝 Rendering Page with params:", params);

  // Await both params and searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

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