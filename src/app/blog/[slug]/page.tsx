import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/api/posts/dataApi";
import Image from "next/image";
import SharePost from "@/components/SharePost";
import he from "he";

// Define Post interface
export interface Post {
	id: number;
	title: { rendered: string };
	excerpt: { rendered: string };
	slug: string;
	date: string;
	author: number;
	author_name?: string;
	featured_media: number;
	featured_image_url?: string;
	content?: { rendered: string };
	rankMathMeta?: string; // ✅ Store RankMath meta tags
	rankMathSchema?: string; // ✅ Store RankMath JSON-LD Schema
	_embedded?: {
	  "wp:featuredmedia"?: { source_url: string }[];
	  author?: { name: string }[];
	};
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
    description: post.seoDescription,
    openGraph: {
      title: `${decodedTitle} - A11Y Pros`,
      description: post.seoDescription,
      url: postUrl,
      type: "article",
      images: post.featured_image_url ? [{ url: post.featured_image_url, width: 1200, height: 630 }] : `${process.env.NEXT_PUBLIC_URL}/og_banner.jpg`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedTitle} - A11Y Pros`,
      description: post.seoDescription,
      images: post.featured_image_url ? [post.featured_image_url] : `${process.env.NEXT_PUBLIC_URL}/og_banner.jpg`,
    },
    alternates: {
      canonical: `${postUrl}`,
    },
  };
}

export default async function BlogPost({ params }: PageProps ) {
  const resolvedParams = await params; // ✅ Await params before using
  const post: Post | null = await getPostBySlug(resolvedParams?.slug);

  if (!post) {
    return notFound(); // Handles missing posts at the server level
  }

   // ✅ Ensure `post.content.rendered` is defined
   const postContent = post.content?.rendered || "<p>No content available.</p>";

  // ✅ Construct the post URL on the server
  const siteUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const postUrl = `${siteUrl}/blog/${resolvedParams.slug}`;

  return (
    <main id="main-content">
      <div className="blog max-w-6xl mx-auto p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Author & Date */}
          <aside className="w-full md:w-1/4 border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6 text-gray-600">
            <div className="flex flex-row justify-between text-left md:block">
              <div className="w-1/2 md:w-full">
                <p className="text-lg font-semibold">By {post.author_name}</p>
                <p className="mt-0">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="w-1/2 md:w-full flex justify-end md:justify-start">
                <SharePost url={postUrl} title={post.title.rendered} />
              </div>
            </div>
          </aside>

          {/* Right Column: Blog Content */}
          <div className="w-full md:w-3/4">
            <h1
              className="text-3xl font-bold mb-6"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="mb-6">
                <Image
                  src={post.featured_image_url}
                  alt={`${post.title.rendered}`}
                  width={600}
                  height={350}
                  className="w-3/5 h-auto mx-auto"
                  priority
                />
              </div>
            )}

            <article
              className="prose lg:prose-xl"
              dangerouslySetInnerHTML={{ __html: postContent }}
              suppressHydrationWarning
            />
          </div>
        </div>
      </div>

      {/* ✅ Inject RankMath JSON-LD Schema */}
      {post.rankMathSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: post.rankMathSchema }}
        />
      )}
    </main>
  );
}
