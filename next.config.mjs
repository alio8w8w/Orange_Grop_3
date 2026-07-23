import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aici păstrezi alte opțiuni pe care le aveai în next.config.js
};

export default withNextIntl(nextConfig);