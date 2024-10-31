/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  webpack(config) {
    config.module.rules.push({
      loader: '@svgr/webpack',
      options: {
        prettier: false,
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: { removeViewBox: false },
              },
            },
          ],
        },
        titleProp: true,
      },
      test: /\.svg$/,
    });

    return config;
  },
  // transpilePackages: ['next-auth'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'networky.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
    domains: ['img.youtube.com', 'i.ytimg.com'],
  },
};

module.exports = withSentryConfig(nextConfig, {
  org: 'recurtech-uu',
  project: 'minime-club',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true, // Can be used to suppress logs
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: '/api/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,

  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#opt-out-of-auto-instrumentation-on-specific-routes
  excludeServerRoutes: ['/api/auth/[...nextauth]'],
});
