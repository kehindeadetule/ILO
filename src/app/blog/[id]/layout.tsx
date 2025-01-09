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

// Define correct types for generateMetadata
type GenerateMetadataProps = {
  params: { id: string };
};

// Dynamic metadata generation
export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  try {
    const response = await fetch(
      `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=1`
    );

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    const blogs = await response.json();
    console.log('Fetched blog:', blogs);
    console.log('Params ID:', params.id);

    const blog = blogs.find((b: Blog) => b.id === Number(params.id));

    if (blog) {
      const { imageUrl, formatedContent } = formatedBookContent(
        blog.content.rendered
      );

      console.log('Found blog:', blog);

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

  // Return default metadata if blog not found or in case of error
  return {
    title: pageMetaTags.blog.title,
    description: pageMetaTags.blog.description,
  };
}

// Define correct types for layout props
type LayoutProps = {
  children: React.ReactNode;
  params: { id: string };
};

export default function BlogLayout({ children, params }: LayoutProps) {
  return <>{children}</>;
}
