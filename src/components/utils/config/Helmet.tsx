// components/Helmet.tsx
'use client';
import React, { useEffect } from 'react';
import Head from 'next/head';
import { pageMetaTags, defaultMetaTags } from '../config/metaTags';

interface HelmetProps {
  pageKey: keyof typeof pageMetaTags;
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
  customType?: string;
}

const Helmet: React.FC<HelmetProps> = ({
  pageKey,
  customTitle,
  customDescription,
  customImage,
  customType,
}) => {
  const pageMeta = pageMetaTags[pageKey];

  const title = customTitle || pageMeta.title;
  const description = customDescription || pageMeta.description;
  const image = customImage || pageMeta.image || defaultMetaTags.defaultImage;
  const type = customType || pageMeta.type || 'website';

  useEffect(() => {
    // Fallback title if needed, this will run after page load
    document.title = title || defaultMetaTags.siteName;
  }, [title]);

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={defaultMetaTags.defaultKeywords} />
      <meta name='author' content={defaultMetaTags.defaultAuthor} />

      {/* Open Graph / Facebook */}
      <meta property='og:type' content={type} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      <meta property='og:site_name' content={defaultMetaTags.siteName} />

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
    </Head>
  );
};

export default Helmet;
