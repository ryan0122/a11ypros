import { MetadataRoute } from 'next';
import { getSitemapUrls } from '@/lib/sitemap';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapUrls = await getSitemapUrls();

  return sitemapUrls.map((item) => ({
    url: item.url,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: item.type === 'home' ? 1.0 : 0.8,
  }));
}

