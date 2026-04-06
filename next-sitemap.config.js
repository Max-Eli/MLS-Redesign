/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://manhattanlaserspa.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/cart', '/checkout', '/wp-admin'] },
    ],
  },
  exclude: ['/api/*', '/cart', '/checkout'],
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
}
