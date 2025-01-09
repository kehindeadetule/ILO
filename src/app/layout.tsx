import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'Ibidun Layi Ojo',
  description: "Welcome to Ibidun Layi Ojo's official website.",
  openGraph: {
    title: 'Ibidun Layi Ojo',
    description: "Welcome to Ibidun Layi Ojo's official website.",
    url: 'https://blog.ibidunlayiojo.com/wp-json/wp/v2',
    images: [
      { url: 'https://ilo-m8j1.vercel.app/assets/about-banner.png' },
    ],
    siteName: 'Ibidun Layi Ojo',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
