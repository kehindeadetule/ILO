import { Metadata } from 'next';
import { formatedBookContent, stripHtmlTagsAndDecode, toTitleCase } from '@/components/utils/utils';
import {
  defaultMetaTags,
  pageMetaTags,
} from '@/components/utils/config/metaTags';

interface Book {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const id = (await params).id;

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
        description: stripHtmlTagsAndDecode(formatedContent.slice(0, 160)) as string,
        openGraph: {
          title: book.title.rendered,
          description: stripHtmlTagsAndDecode(formatedContent.slice(0, 160)) as string,
          url: `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=31&${id}`,
          images: [{ url: imageUrl || '' }],
          siteName: defaultMetaTags.siteName,
        },
        twitter: {
          card: 'summary_large_image',
          title: book.title.rendered,
          description: stripHtmlTagsAndDecode(formatedContent.slice(0, 160)) as string,
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
