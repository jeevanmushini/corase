import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/mongoose';
import Product from '@/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://corase.in';

  // Static routes
  const staticRoutes = [
    '',
    '/shop',
    '/collections',
    '/about',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic products — query DB directly instead of fetch (avoids DNS issues at build time)
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectToDatabase();
    const products = await Product.find({}).select('id').lean();
    productRoutes = (products as any[]).map((p) => ({
      url: `${baseUrl}/product/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error("Sitemap product fetch failed", e);
  }

  return [...staticRoutes, ...productRoutes];
}
