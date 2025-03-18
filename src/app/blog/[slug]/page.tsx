import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/api/posts/dataApi";
import Image from "next/image";

// Update the Post interface to match our updated API
interface Post {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  author_name: string;
  featured_media: number;
  featured_image_url?: string; // New field from our updated API
}

// Keep both params and searchParams in the type to match Next.js expectations
type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogPost({ params }: PageProps) {
  const resolvedParams = "then" in params ? await params : params;
  const post: Post | null = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return notFound();
  }

  // Check if featured image URL exists
  const hasFeaturedImage = !!post.featured_image_url;

  return (
    <div className="blog max-w-6xl mx-auto p-8">
      <div className="flex gap-8">
        {/* Left Column: Author & Date */}
        <aside className="w-1/4 border-r pr-6 text-gray-600">
          <p className="text-lg font-semibold">By {post.author_name}</p>
          <p className="mt-0">{new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
        </aside>

        {/* Right Column: Blog Content */}
        <div className="w-3/4">
          <h1 className="text-3xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          
          {/* Featured Image */}
          {hasFeaturedImage && (
            <div className="mb-6">
              <Image 
                src={post.featured_image_url!}
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
  );
}