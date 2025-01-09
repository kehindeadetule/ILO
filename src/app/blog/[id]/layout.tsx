import { Metadata } from 'next';
import { formatedBookContent, toTitleCase } from '@/components/utils/utils';
import {
  defaultMetaTags,
  pageMetaTags,
} from '@/components/utils/config/metaTags';

interface Blog {
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
      `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=1`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    const blogs = await response.json();
    const blog = blogs.find((b: Blog) => b.id === Number(params.id));

    if (blog) {
      const { imageUrl, formatedContent } = formatedBookContent(
        blog.content.rendered
      );

      return {
        title: toTitleCase(blog.title.rendered),
        description: formatedContent.slice(0, 160),
        openGraph: {
          title: blog.title.rendered,
          description: formatedContent.slice(0, 160),
          url: `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=1&${params.id}`,
          images: [{ url: imageUrl || '' }],
          siteName: defaultMetaTags.siteName,
        },
        twitter: {
          card: 'summary_large_image',
          title: blog.title.rendered,
          description: formatedContent.slice(0, 160),
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

// Define the layout component without explicit params typing
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
