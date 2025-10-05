import { GetServerSideProps } from 'next';
import { getBaseUrl } from '@/lib/utils';

const createSitemap = (urls: string[]) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `<url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = getBaseUrl();
  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/doctors`,
    `${baseUrl}/specializations`,
    `${baseUrl}/hospitals`,
    `${baseUrl}/about`,
    `${baseUrl}/login`,
    `${baseUrl}/register`,
  ];

  res.setHeader('Content-Type', 'text/xml');
  res.write(createSitemap(urls));
  res.end();

  return {
    props: {},
  };
};
