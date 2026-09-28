import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getPostBySlug } from "@/lib/api/posts/dataApi"
import ArticleTemplate from "@/components/templates/ArticleTemplate"
import he from "he"
import { articleStructuredData, toJsonLd } from "@/lib/seo/structuredData"

type PageProps = {
  params: Promise<{ slug: string }>
}

// Generate SEO metadata and social open graph tags
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    return {
      title: "Post Not Found - A11Y Pros",
      description: "This blog post does not exist or has been removed.",
    }
  }

  const decodedTitle = he.decode(post.title.rendered)
  const siteUrl = process.env.NEXT_PUBLIC_URL || "https://a11ypros.com"
  const postUrl = `${siteUrl}/blog/${resolvedParams.slug}`

  return {
    title: `${decodedTitle} - A11Y Pros`,
    description: post.seoDescription || post.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim(),
    openGraph: {
      authors: post.author_name || "A11Y Pros",
      title: `${decodedTitle} - A11Y Pros`,
      description: post.seoDescription || post.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim(),
      url: postUrl,
      type: "article",
      images: post.featured_image_url ? [{ url: post.featured_image_url, width: 1200, height: 630 }] : `${siteUrl}/og_banner.jpg`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedTitle} - A11Y Pros`,
      description: post.seoDescription || post.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim(),
      images: post.featured_image_url ? [post.featured_image_url] : `${siteUrl}/og_banner.jpg`,
    },
    alternates: {
      canonical: postUrl,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    return notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_URL || "https://a11ypros.com"
  const postUrl = `${siteUrl}/blog/${resolvedParams.slug}`

  const structuredData = articleStructuredData({
    slug: post.slug,
    title: post.title.rendered,
    description: post.seoDescription || "",
    date: post.date,
    authorName: post.author_name,
    image: post.featured_image_url,
    schemaType: post.schemaType,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(structuredData) }}
      />
      <ArticleTemplate post={post} postUrl={postUrl} />
    </>
  )
}
