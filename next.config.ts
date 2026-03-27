import withPWAInit from 'next-pwa';
import type { NextConfig } from 'next';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Desativa no modo dev para não atrapalhar o hot-reload
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Outras configurações do Next.js entrarão aqui no futuro
};

export default withPWA(nextConfig);