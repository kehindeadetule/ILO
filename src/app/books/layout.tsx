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
    url: 'https://ibidunlayiojo.com/books',
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
