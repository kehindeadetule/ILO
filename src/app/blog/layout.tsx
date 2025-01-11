import {
  pageMetaTags,
  defaultMetaTags,
} from '@/components/utils/config/metaTags';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: pageMetaTags.blog.title,
  description: pageMetaTags.blog.description,
  openGraph: {
    title: pageMetaTags.blog.title,
    description: pageMetaTags.blog.description,
    url: 'https://blog.ibidunlayiojo.com/blog',
    images: [{ url: pageMetaTags.blog.image }],
    siteName: defaultMetaTags.siteName,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
