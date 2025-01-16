import {
  pageMetaTags,
  defaultMetaTags,
} from '@/components/utils/config/metaTags';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: pageMetaTags.contact.title,
  description: pageMetaTags.contact.description,
  openGraph: {
    title: pageMetaTags.contact.title,
    description: pageMetaTags.contact.description,
    url: 'https://ibidunlayiojo.com/contact',
    images: [{ url: pageMetaTags.contact.image }],
    siteName: defaultMetaTags.siteName,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
