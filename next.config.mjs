

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
    ],
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
