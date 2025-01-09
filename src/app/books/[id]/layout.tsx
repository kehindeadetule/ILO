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

// Define the correct metadata types
type GenerateMetadataProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Dynamic metadata generation
export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  try {
    const response = await fetch(
      `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=31`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const books = await response.json();
    const book = books.find((b: Book) => b.id === Number(params.id));

    if (book) {
      const { imageUrl, formatedContent } = formatedBookContent(
        book.content.rendered
      );

      return {
        title: book.title.rendered,
        description: formatedContent.slice(0, 160),
        openGraph: {
          title: toTitleCase(book.title.rendered),
          description: formatedContent.slice(0, 160),
          url: `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=31&${params.id}`,
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

// Define the layout component without explicit params typing
export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
