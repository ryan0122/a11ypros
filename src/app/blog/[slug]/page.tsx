import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/api/posts/dataApi";
import Image from "next/image";
import SharePost from "@/components/SharePost";
import he from "he";

// Define Post interface
interface Post {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  author_name: string;
  featured_media: number;
  featured_image_url?: string;
  slug?: string;
}

// Define PageProps
type PageProps = {
  params: Promise<{ slug: string }>; // Await this
};

// ✅ Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params; // ✅ Await params before using
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Post Not Found - A11Y Pros",
      description: "This blog post does not exist or has been removed.",
    };
  }

  // Decode HTML entities in the title
  const decodedTitle = he.decode(post.title.rendered);
  
  // Site URL for canonical links
  const siteUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const postUrl = `${siteUrl}/blog/${resolvedParams.slug}`;

  return {
    title: `${decodedTitle} - A11Y Pros`,
    description: post.content.rendered.substring(0, 150).replace(/<\/?[^>]+(>|$)/g, ""), // Extract a short text snippet
    openGraph: {
      title: `${decodedTitle} - A11Y Pros`,
      description: post.content.rendered.substring(0, 150).replace(/<\/?[^>]+(>|$)/g, ""),
      url: postUrl,
      type: "article",
      images: post.featured_image_url ? [{ url: post.featured_image_url, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedTitle} - A11Y Pros`,
      description: post.content.rendered.substring(0, 150).replace(/<\/?[^>]+(>|$)/g, ""),
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL}/${postUrl}`,
    },
  };
}

export default async function BlogPost({ params }: PageProps ) {
  const resolvedParams = await params; // ✅ Await params before using
  const post: Post | null = await getPostBySlug(resolvedParams?.slug);

  if (!post) {
    return notFound(); // Handles missing posts at the server level
  }

  // ✅ Construct the post URL on the server
  const siteUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const postUrl = `${siteUrl}/blog/${resolvedParams.slug}`;

  return (
    <main id="main-content">
      <div className="blog max-w-6xl mx-auto p-8">
        <div className="flex gap-8">
          {/* Left Column: Author & Date */}
          <aside className="w-1/4 border-r pr-6 text-gray-600">
            <p className="text-lg font-semibold">By {post.author_name}</p>
            <p className="mt-0">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
           <SharePost url={postUrl} title={post.title.rendered} />
          </aside>

          {/* Right Column: Blog Content */}
          <div className="w-3/4">
            <h1 className="text-3xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="mb-6">
                <Image
                  src={post.featured_image_url}
                  alt={`Featured image for ${post.title.rendered}`}
                  width={600}
                  height={350}
                  className="w-full h-auto rounded-lg"
                  priority
                />
              </div>
            )}

            <article className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: post.content.rendered }} suppressHydrationWarning />
          </div>
        </div>
      </div>
    </main>
  );
}
