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
// Dynamic metadata generation
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    console.log(
      'Fetching books from:',
      `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=31`
    );

    const response = await fetch(
      `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=31`
    );

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const books = await response.json();
    console.log('Fetched books:', books);
    console.log('Params ID:', params.id);

    const book = books.find((b: Book) => b.id === Number(params.id));

    if (book) {
      const { imageUrl, formatedContent } = formatedBookContent(
        book.content.rendered
      );

      console.log('Found book:', book);

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

  // Return default metadata if book not found or in case of error
  return {
    title: pageMetaTags.books.title,
    description: pageMetaTags.books.description,
  };
}

type BookLayoutProps = {
  children: React.ReactNode;
  // params: { id: string };
};

export default function BookLayout({ children }: BookLayoutProps) {
  return <>{children}</>;
}
