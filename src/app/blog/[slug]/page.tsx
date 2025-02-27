import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/api/posts/dataApi";

interface Post {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
}

// Keep both params and searchParams in the type to match Next.js expectations
type PageProps = {
	params: Promise<{ slug: string }>;
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  };
  

export default async function BlogPost({ params }: PageProps) {
	const resolvedParams = 'then' in params ? await params : params;
	const post: Post | null = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return notFound();
  }

  return (
    <div className="blog max-w-4xl mx-auto p-8" suppressHydrationWarning>
      <h1 className="text-3xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <article className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: post.content.rendered }} suppressHydrationWarning/>
    </div>
  );
}
