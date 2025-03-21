const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'http://localhost:10000',
  },
};

export default nextConfig;