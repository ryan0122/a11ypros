import { notFound } from "next/navigation";
import PageTemplate from "@/components/PageTemplate";

// ✅ Explicitly cast `params` to ensure it's treated as an object
interface PageProps {
  params: { slug: string } | Promise<{ slug: string }>;
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

export default async function Page({ params }: PageProps) {
  console.log("📝 Raw params before fix:", params);

  // ✅ Ensure `params` is always an object, not a Promise
  const fixedParams = (await params) as { slug: string };

  console.log("📝 Fixed params after casting:", fixedParams);

  if (!fixedParams || typeof fixedParams.slug !== "string") {
    console.error("❌ ERROR: Invalid params object", fixedParams);
    notFound();
  }

  const page = await getPageData(fixedParams.slug);

  if (!page) {
    console.warn("⚠️ No page found for:", fixedParams.slug);
    notFound();
  }

  return <PageTemplate title={page.title.rendered} content={page.content.rendered} />;
}
