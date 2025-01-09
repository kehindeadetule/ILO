import {
  pageMetaTags,
  defaultMetaTags,
} from '@/components/utils/config/metaTags';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: pageMetaTags.books.title,
  description: pageMetaTags.books.description,
  openGraph: {
    title: pageMetaTags.books.title,
    description: pageMetaTags.books.description,
    url: 'https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=31',
    images: [{ url: pageMetaTags.books.image }],
    siteName: defaultMetaTags.siteName,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
