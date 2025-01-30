import { notFound } from "next/navigation";
import PageTemplate from "@/components/PageTemplate";

// To this:
type PageProps = {
	params: { slug: string }
  };

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

// ✅ Ensure `params` is always a plain object
export default async function Page({ params }: PageProps) {
  console.log("📝 Rendering Page with params:", params);

  if (!params || typeof params.slug !== "string") {
    console.error("❌ ERROR: Invalid params object", params);
    notFound();
  }

  const page = await getPageData(params.slug);

  if (!page) {
    console.warn("⚠️ No page found for:", params.slug);
    notFound();
  }

  return <PageTemplate title={page.title.rendered} content={page.content.rendered} />;
}
