import { getPosts, Post } from "@/lib/api/posts/dataApi";
import type { Metadata } from "next";
import Image from "next/image";

const siteUrl = process.env.NEXT_PUBLIC_URL || "https://a11ypros.com";

export async function generateMetadata(): Promise<Metadata> {
	return {
	  title: "Web Accessibility and ADA Compliance Articles - A11Y Pros",
	  description: "Explore expert articles on web accessibility, ADA compliance, and WCAG guidelines. Learn how to make your website accessible.",
	  alternates: {
		canonical: `${siteUrl}/blog`, // ✅ Add canonical URL
	  },
	  openGraph: {
		title: "Web Accessibility and ADA Compliance Articles - A11Y Pros",
		description: "Explore expert articles on web accessibility, ADA compliance, and WCAG guidelines. Learn how to make your website accessible.",
		url: `${siteUrl}/blog`,
		type: "website",
		images: [
			{
			  url: `${process.env.NEXT_PUBLIC_URL}/og_banner.jpg`,
			  alt: 'A11Y Pros Logo',
			  width: 1200,  
          	  height: 630,
			},
		  ],
	  },
	  twitter: {
		card: "summary_large_image",
		title: "Web Accessibility and ADA Compliance Articles - A11Y Pros",
		description: "Explore expert articles on web accessibility, ADA compliance, and WCAG guidelines. Learn how to make your website accessible.",
		images: [`${process.env.NEXT_PUBLIC_URL}/og_banner.jpg`],
	  },
	};
  }

export default async function Blog() {
  const posts: Post[] = await getPosts(); // ✅ Fetches data on the server before rendering

  return (
	<main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<header className="text-center mb-12">
			<h1 className="text-3xl font-semibold mb-6">Web Accessibility & ADA Compliance Articles</h1>
		</header>
	  
	  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		{posts.map((post) => (
		  <li key={post.id} className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
			{/* ✅ Featured Image */}
				  {post.featured_image_url && (
					  <div className="mb-4">
						<Image
						  src={post.featured_image_url}
						  alt={`${post.title.rendered}`}
						  className="w-full h-48"
						  loading="lazy"
						  width={100}
						  height={100}
						/>
					  </div>
			)}
			<h2 className="text-2xl font-semibold mb-4">
			  <a
				href={`/blog/${post.slug}`}
				dangerouslySetInnerHTML={{ __html: post.title.rendered }}
			  />
			</h2>
			<p
			  className="text-gray-700 mb-4"
			  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
			/>
			<a
			  href={`/blog/${post.slug}`}
			  className="inline-block mt-2"
			>
			  Read More →
			</a>
		  </li>
		))}
	  </ul>
	</main>
  );
}
