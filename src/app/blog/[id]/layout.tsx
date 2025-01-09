import { Metadata } from 'next';
import { formatedBookContent, stripHtmlTags, toTitleCase } from '@/components/utils/utils';
import {
  defaultMetaTags,
  pageMetaTags,
} from '@/components/utils/config/metaTags';
import parse from 'html-react-parser';

interface Blog {
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
      `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=1`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    const blogs = await response.json();
    const blog = blogs.find((b: Blog) => b.id === Number(id));

    if (blog) {
      const { imageUrl, formatedContent } = formatedBookContent(
        blog.content.rendered
      );

      return {
        metadataBase: new URL('https://blog.ibidunlayiojo.com'),
        title: toTitleCase(blog.title.rendered),
        description: stripHtmlTags(formatedContent.slice(0, 160)) as string,
        openGraph: {
          title: blog.title.rendered,
          description: stripHtmlTags(formatedContent.slice(0, 160)) as string,
          url: `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=1&${id}`,
          images: [{ url: imageUrl || '' }],
          siteName: defaultMetaTags.siteName,
        },
        twitter: {
          card: 'summary_large_image',
          title: blog.title.rendered,
          description: stripHtmlTags(formatedContent.slice(0, 160)) as string,
          images: [imageUrl || ''],
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: pageMetaTags.blog.title,
    description: pageMetaTags.blog.description,
  };
}

// Layout component for blog
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
