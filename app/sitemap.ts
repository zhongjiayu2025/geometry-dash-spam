import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '../data/blogContent';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://geometrydashspam.cc';

  // Static Routes
  const routes = [
    '',
    '/cps-test',
    '/jitter-click',
    '/butterfly-click',
    '/right-click',
    '/spacebar-counter',
    '/reaction-test',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Blog Routes
  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString().split('T')[0], // Parse friendly date string
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...blogRoutes];
}