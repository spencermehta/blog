// We do not want a random preview id on each build because we do not use the feature
// https://github.com/vercel/next.js/issues/15609
require("crypto").randomBytes = () => "FIXED_PREVIEW_MODE_ID";
const md5Dir = require("md5-dir");
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return md5Dir("src");
  },
  i18n: {
    locales: ["en-GB", "fr-FR", "de-DE"],
    defaultLocale: "en-GB",
  },
  images: {
    domains: ["images.ctfassets.net"],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
};

module.exports = nextConfig;
