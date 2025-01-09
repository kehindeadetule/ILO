// app/books/[id]/layout.tsx

import { Metadata } from 'next';
import { formatedBookContent, toTitleCase } from '@/components/utils/utils';
import {
  defaultMetaTags,
  pageMetaTags,
} from '@/components/utils/config/metaTags';

interface Book {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
}

//@ts-ignore
export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    const { id } = params;

    const response = await fetch(
      `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=31`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const books = await response.json();
    const book = books.find((b: Book) => b.id === Number(id));

    if (book) {
      const { imageUrl, formatedContent } = formatedBookContent(
        book.content.rendered
      );

      return {
        metadataBase: new URL('https://blog.ibidunlayiojo.com'),
        title: toTitleCase(book.title.rendered),
        description: formatedContent.slice(0, 160),
        openGraph: {
          title: book.title.rendered,
          description: formatedContent.slice(0, 160),
          url: `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=31&${id}`,
          images: [{ url: imageUrl || '' }],
          siteName: defaultMetaTags.siteName,
        },
        twitter: {
          card: 'summary_large_image',
          title: book.title.rendered,
          description: formatedContent.slice(0, 160),
          images: [imageUrl || ''],
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: pageMetaTags.books.title,
    description: pageMetaTags.books.description,
  };
}

// Layout component
export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
