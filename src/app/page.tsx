import HomePage from '@/components/home/HomePage';
import {
  pageMetaTags,
  defaultMetaTags,
} from '@/components/utils/config/metaTags';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: pageMetaTags.home.title,
  description: pageMetaTags.home.description,
  openGraph: {
    title: pageMetaTags.home.title,
    description: pageMetaTags.home.description,
    url: 'https://blog.ibidunlayiojo.com',
    images: [{ url: pageMetaTags.home.image }],
    siteName: defaultMetaTags.siteName,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function Home() {
  return (
    <section>
      <HomePage />
    </section>
  );
}
