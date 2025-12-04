import { getPostsForListing, Post } from "@/lib/api/posts/dataApi";
import type { Metadata } from "next";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Breadcrumbs from "@/components/Breadcrumbs";

const siteUrl = process.env.NEXT_PUBLIC_URL || "https://a11ypros.com";

interface MetadataProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ searchParams }: MetadataProps): Promise<Metadata> {
	const resolvedSearchParams = await searchParams;
	const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
	
	// Generate canonical URL - page 1 is just /blog, others include ?page=X
	const canonicalUrl = currentPage > 1 
		? `${siteUrl}/blog?page=${currentPage}`
		: `${siteUrl}/blog`;

	return {
	  title: currentPage > 1 
		? `Web Accessibility and ADA Compliance Articles - Page ${currentPage} - A11Y Pros`
		: "Web Accessibility and ADA Compliance Articles - A11Y Pros",
	  description: "Explore expert articles on web accessibility, ADA compliance, and WCAG guidelines. Learn how to make your website accessible.",
	  alternates: {
		canonical: canonicalUrl,
	  },
	  openGraph: {
		title: currentPage > 1
			? `Web Accessibility and ADA Compliance Articles - Page ${currentPage} - A11Y Pros`
			: "Web Accessibility and ADA Compliance Articles - A11Y Pros",
		description: "Explore expert articles on web accessibility, ADA compliance, and WCAG guidelines. Learn how to make your website accessible.",
		url: canonicalUrl,
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
		title: currentPage > 1
			? `Web Accessibility and ADA Compliance Articles - Page ${currentPage} - A11Y Pros`
			: "Web Accessibility and ADA Compliance Articles - A11Y Pros",
		description: "Explore expert articles on web accessibility, ADA compliance, and WCAG guidelines. Learn how to make your website accessible.",
		images: [`${process.env.NEXT_PUBLIC_URL}/og_banner.jpg`],
	  },
	};
  }

interface BlogProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Blog({ searchParams }: BlogProps) {
  const posts: Post[] = await getPostsForListing(); // ✅ Optimized: fast fetch without RankMath or extra API calls
  
  // Await searchParams and get current page, default to 1
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const postsPerPage = 9;
  
  // Calculate pagination
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // Slice posts for current page
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  return (
	<>
	<div className='max-w-6xl mx-auto'>
	<Breadcrumbs/>
  	</div>  
	<main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<header className="text-center mb-12">
			<h1 className="text-3xl font-semibold mb-6">Web Accessibility & ADA Compliance Articles</h1>
		</header>
	  
	  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		{paginatedPosts.map((post) => (
		  <li key={post.id} className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
			{/* ✅ Featured Image */}
			{post.featured_image_url && (
			  <div className="mb-4">
				<Image
				  src={post.featured_image_url}
				  alt={`${post.title.rendered}`}
				  loading="lazy"
				  width={350}
				  height={400}
				/>
			  </div>
			)}
			<h2 className="text-2xl font-semibold mb-4">
			  <a
				href={`/blog/${post.slug}`}
				dangerouslySetInnerHTML={{ __html: post.title.rendered }}
			  />
			</h2>
			<small className="text-gray-500 text-sm">
				{new Date(post.date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</small>
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
	  
	  <Pagination currentPage={currentPage} totalPages={totalPages} />
	</main>
	</>
  );
}
