import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/api/posts/dataApi";

interface Post {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post: Post | null = await getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <article className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </div>
  );
}
