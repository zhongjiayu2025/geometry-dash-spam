import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://geometrydashspam.cc';
  
  // List all routes for better SEO indexing
  const routes = [
    '',
    '/jitter-click',
    '/butterfly-click',
    '/drag-click',
    '/spacebar-counter',
    '/scroll-test',
    '/reaction-time',
    '/sound-reaction',
    '/chimp-test',
    '/visual-memory',
    '/aim-trainer',
    '/keyboard-latency',
    '/polling-rate',
    '/mouse-acceleration',
    '/keyboard-ghosting',
    '/key-rollover',
    '/bpm-tapper',
    '/refresh-rate',
    '/cps-test',
    '/right-click',
    '/double-click',
    '/1-second-cps-test',
    '/2-second-cps-test',
    '/3-second-cps-test',
    '/5-second-cps-test',
    '/10-second-cps-test',
    '/15-second-cps-test',
    '/30-second-cps-test',
    '/60-second-cps-test',
    '/100-second-cps-test',
    '/leaderboard',
    '/stats'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
