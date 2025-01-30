import PageTemplate from "@/components/PageTemplate";
import { notFound } from "next/navigation";

interface Params {
  slug: string;
}

const authHeader = "Basic YTExeXByb2NtczpOQlZPIHRkOFogSHlxTyBoVmYzIHVtVEEgZkhjUg==";

async function getPageData(slug: string) {
  if (!process.env.NEXT_PUBLIC_CMS_URL) {
    console.error("❌ ERROR: `CMS_URL` is not defined in `.env.local`");
    return null;
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_CMS_URL}/pages?slug=${slug}`;
  console.log("📡 Fetching WordPress page from:", apiUrl);

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store", // Ensure fresh data
      headers: {
        Authorization: authHeader,
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

export default async function Page({ params }: { params: Params }) {
  const { slug } = params; // ✅ Destructure `params` properly
  console.log("📝 Rendering Page for:", slug);

  const page = await getPageData(slug);

  if (!page) {
    console.warn("⚠️ No page found for:", slug);
    notFound(); // Triggers 404 page
  }

  return <PageTemplate title={page.title.rendered} content={page.content.rendered} />;
}
