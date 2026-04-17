

const securityHeaders = [
  // Prevents clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Stops MIME sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Forces HTTPS
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Controls referrer info
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Restricts browser features
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Content Security Policy — allows Stripe, Supabase, Google Maps, Behold
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https://api.stripe.com https://*.supabase.co https://feeds.behold.so https://maps.googleapis.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://www.google.com",
      "worker-src blob:",
    ].join('; '),
  },
]

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'manhattanlaserspa.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
      },
      // Instagram / Behold CDN domains
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: '*.behold.pictures',
      },
      // Skincare brand CDNs
      {
        protocol: 'https',
        hostname: 'us.alumiermd.com',
        pathname: '/cdn/shop/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [
      // NYC location pages → Sunny Isles equivalents
      { source: '/new-york/:path*', destination: '/sunny-isles-beach/:path*', permanent: true },
      { source: '/nyc/:path*', destination: '/sunny-isles-beach/:path*', permanent: true },
      { source: '/manhattan/:path*', destination: '/sunny-isles-beach/:path*', permanent: true },
      { source: '/locations/new-york', destination: '/contact', permanent: true },
      { source: '/locations/manhattan', destination: '/contact', permanent: true },
      { source: '/locations/brooklyn', destination: '/contact', permanent: true },
      { source: '/locations/upper-east-side', destination: '/contact', permanent: true },
      { source: '/locations/midtown', destination: '/contact', permanent: true },
    ]
  },
}

export default nextConfig
