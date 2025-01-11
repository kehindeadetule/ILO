import { Metadata } from 'next';
import {
  extractAndRemoveImage,
  stripHtmlTagsAndDecode,
  toTitleCase,
} from '@/components/utils/utils';
import {
  defaultMetaTags,
  pageMetaTags,
} from '@/components/utils/config/metaTags';

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
      `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts/${id}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }

    const blog = await response.json();
    // console.log(blog )

    const { imageUrl, formatedContent } = extractAndRemoveImage(
      blog.content.rendered
    );

    // console.log(imageUrl, formatedContent, )

    return {
      metadataBase: new URL('https://blog.ibidunlayiojo.com/blog'),
      title: toTitleCase(stripHtmlTagsAndDecode(blog.title.rendered)),
      description: stripHtmlTagsAndDecode(formatedContent.slice(0, 160)),
      openGraph: {
        title: toTitleCase(stripHtmlTagsAndDecode(blog.title.rendered)),
        description: stripHtmlTagsAndDecode(formatedContent.slice(0, 160)),
        url: `https://blog.ibidunlayiojo.com/blog/${id}`,
        images: [{ url: imageUrl || '/default-image.jpg' }],
        siteName: defaultMetaTags.siteName,
      },
      twitter: {
        card: 'summary_large_image',
        title: toTitleCase(stripHtmlTagsAndDecode(blog.title.rendered)),
        description: stripHtmlTagsAndDecode(formatedContent.slice(0, 160)),
        images: [imageUrl || '/default-image.jpg'],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: pageMetaTags.blog.title,
    description: pageMetaTags.blog.description,
  };
}

// Layout component for blog
export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
