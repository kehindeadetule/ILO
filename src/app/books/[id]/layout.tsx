import { Metadata } from 'next';
import {
  formatedBookContent,
  stripHtmlTagsAndDecode,
  toTitleCase,
} from '@/components/utils/utils';
import {
  defaultMetaTags,
  pageMetaTags,
} from '@/components/utils/config/metaTags';

interface Book {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
}

 export async function generateStaticParams() {
   try {
     const response = await fetch(
       `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=31`
     );

     if (!response.ok) {
       throw new Error('Failed to fetch books');
     }

     const books: Book[] = await response.json();

     // Return a list of paths with `id` for static generation
     return books.map((book) => ({
       id: book.id.toString(),
     }));
   } catch (error) {
     console.error('Error generating static params:', error);
     return [];
   }
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
        metadataBase: new URL('https://ibidunlayiojo.com'),
        title: toTitleCase(stripHtmlTagsAndDecode(book.title.rendered)),
        description: stripHtmlTagsAndDecode(
          formatedContent.slice(0, 160)
        ) as string,
        openGraph: {
          title: toTitleCase(stripHtmlTagsAndDecode(book.title.rendered)),
          description: stripHtmlTagsAndDecode(
            formatedContent.slice(0, 160)
          ) as string,
          url: `https://ibidunlayiojo.com/books/${id}`,
          images: [{ url: imageUrl || '' }],
          siteName: defaultMetaTags.siteName,
        },
        twitter: {
          card: 'summary_large_image',
          title: toTitleCase(stripHtmlTagsAndDecode(book.title.rendered)),
          description: stripHtmlTagsAndDecode(
            formatedContent.slice(0, 160)
          ) as string,
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
export default function BookPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
