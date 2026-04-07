import type { MetadataRoute } from 'next'
import { getAllServiceSlugs } from '@/lib/services'
import { getAllPostSlugs } from '@/lib/wordpress'
import { servicesData } from '@/lib/servicesData'

const BASE = 'https://manhattanlaserspa.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceSlugs, postSlugs] = await Promise.all([
    getAllServiceSlugs().catch(() => [] as string[]),
    getAllPostSlugs().catch(() => [] as string[]),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                   lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/shop`,         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/services`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/about`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/financing`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/referral`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/promotions`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/privacy`,      lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,        lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/refund-policy`,lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/hipaa`,        lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const productPages: MetadataRoute.Sitemap = serviceSlugs.map(slug => ({
    url:             `${BASE}/product/${slug}`,
    lastModified:    new Date(),
    changeFrequency: 'weekly',
    priority:        0.8,
  }))

  const servicePages: MetadataRoute.Sitemap = servicesData.map(s => ({
    url:             `${BASE}/services/${s.slug}`,
    lastModified:    new Date(),
    changeFrequency: 'monthly',
    priority:        0.7,
  }))

  const blogPages: MetadataRoute.Sitemap = postSlugs.map(slug => ({
    url:             `${BASE}/blog/${slug}`,
    lastModified:    new Date(),
    changeFrequency: 'monthly',
    priority:        0.6,
  }))

  return [...staticPages, ...productPages, ...servicePages, ...blogPages]
}
