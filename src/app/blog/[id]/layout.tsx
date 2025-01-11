import { Metadata } from 'next';
import {
  // extractAndRemoveImage,
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

    const response = await fetch(
      `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=1`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    // const blogs = await response.json();

    // const blog = blogs.find((b: Blog) => b.id === Number(id));

    // if (blog) {
    //   const { imageUrl, formatedContent } = extractAndRemoveImage(
    //     blog.content.rendered
    //   );
    // console.log('blog details', imageUrl, formatedContent, blog.title.rendered)
    const blog = {
      title: 'hello blog',
    };
    const formatedContent = 'desc hello blog';
    const imageUrl = '/assets/contact-bg.png';

    return {
      metadataBase: new URL('https://blog.ibidunlayiojo.com/blog'),
      title: toTitleCase(stripHtmlTagsAndDecode(blog.title)),
      description: stripHtmlTagsAndDecode(
        formatedContent.slice(0, 160)
      ) as string,
      openGraph: {
        title: toTitleCase(stripHtmlTagsAndDecode(blog.title)),
        description: stripHtmlTagsAndDecode(
          formatedContent.slice(0, 160)
        ) as string,
        url: `https://blog.ibidunlayiojo.com/blog/${id}`,
        images: [{ url: imageUrl || '' }],
        siteName: defaultMetaTags.siteName,
      },
      twitter: {
        card: 'summary_large_image',
        title: toTitleCase(stripHtmlTagsAndDecode(blog.title)),
        description: stripHtmlTagsAndDecode(
          formatedContent.slice(0, 160)
        ) as string,
        images: [imageUrl || ''],
      },
    };
    //}
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: pageMetaTags.blog.title,
    description: pageMetaTags.blog.description,
  };
}

// Layout component for blog post
export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
