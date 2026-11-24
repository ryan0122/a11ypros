import { MetadataRoute } from 'next';
import { getSitemapUrls } from '@/lib/sitemap';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapUrls = await getSitemapUrls();

  return sitemapUrls.map((item) => ({
    url: item.url,
    // Stamping every URL with today's date teaches Google to ignore lastmod, so only
    // posts, which have a real date, carry one.
    ...(item.lastModified ? { lastModified: new Date(item.lastModified) } : {}),
    changeFrequency: 'weekly' as const,
    priority: item.type === 'home' ? 1.0 : 0.8,
  }));
}

