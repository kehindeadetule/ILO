import {
  pageMetaTags,
  defaultMetaTags,
} from '@/components/utils/config/metaTags';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: pageMetaTags.login.title,
  description: pageMetaTags.login.description,
  openGraph: {
    title: pageMetaTags.login.title,
    description: pageMetaTags.login.description,
    url: 'https://ibidunlayiojo.com/login',
    images: [{ url: pageMetaTags.login.image }],
    siteName: defaultMetaTags.siteName,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}