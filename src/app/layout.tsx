import type { Metadata } from 'next';
import './globals.css';
import Wrapper from '@/components/common/Wrapper';

export const metadata: Metadata = {
  title: 'Ibidun Layi Ojo',
  description: "Welcome to Ibidun Layi Ojo's official website.",
  openGraph: {
    title: 'Ibidun Layi Ojo',
    description: "Welcome to Ibidun Layi Ojo's official website.",
    url: 'https://ibidunlayiojo.com',
    images: [{ url: 'https://ibidunlayiojo.com/about-banner.png' }],
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
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
