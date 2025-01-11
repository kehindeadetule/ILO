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

// interface Blog {
//   id: number;
//   title: { rendered: string };
//   content: { rendered: string };
// }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const id = (await params).id;
    console.log('ID:', id);

    const url = `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts/${id}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    console.log('Response:', response);

    if (!response.ok) {
      throw new Error('Failed to fetch blog');
    }

    const blog = await response.json();
    console.log('Blog data:', blog); // Log the actual blog data

    // Ensure blog is an object and contains expected fields
    if (blog && blog.id === Number(id)) {
      const { imageUrl, formatedContent } = extractAndRemoveImage(
        blog.content.rendered
      );
      console.log('Image URL:', imageUrl);
      console.log('Formatted Content:', formatedContent);

      const description = formatedContent
        ? stripHtmlTagsAndDecode(formatedContent.slice(0, 160))
        : pageMetaTags.blog.description;
      const image = imageUrl || pageMetaTags.blog.image;

      return {
        metadataBase: new URL('https://blog.ibidunlayiojo.com'),
        title: toTitleCase(stripHtmlTagsAndDecode(blog.title.rendered)),
        description: description,
        openGraph: {
          title: toTitleCase(stripHtmlTagsAndDecode(blog.title.rendered)),
          description: description,
          url: `https://blog.ibidunlayiojo.com/blog/${id}`,
          images: image,
          siteName: defaultMetaTags.siteName,
        },
        twitter: {
          card: 'summary_large_image',
          title: toTitleCase(stripHtmlTagsAndDecode(blog.title.rendered)),
          description: description,
          images: [imageUrl || ''],
        },
      };
    } else {
      console.error('Blog not found or invalid structure');
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
