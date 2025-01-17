import { Metadata } from 'next';
import { formatedBookContent, toTitleCase } from '@/components/utils/utils';
import {
  defaultMetaTags,
  pageMetaTags,
} from '@/components/utils/config/metaTags';

// Generate static params for SSG
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=205&orderby=date&order=desc`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const media = await response.json();

    // Return an array of params with slugs
    return media.map((post: { slug: string }) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for each dynamic page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;

    const response = await fetch(
      `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=205&orderby=date&order=desc`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch media');
    }

    const media = await response.json();

    // Find the episode by matching the slug
    const episode = media.find((b: { slug: string }) => b.slug === slug);

    if (episode) {
      const { imageUrl, formatedContent } = formatedBookContent(
        episode.content.rendered
      );

      return {
        title: toTitleCase(episode.title.rendered),
        description: formatedContent.slice(0, 160),
        openGraph: {
          title: toTitleCase(episode.title.rendered),
          description: formatedContent.slice(0, 160),
          url: `https://blog.ibidunlayiojo.com/media/${(await params).slug}`,
          images: [{ url: imageUrl || '' }],
          siteName: defaultMetaTags.siteName,
        },
        twitter: {
          card: 'summary_large_image',
          title: toTitleCase(episode.title.rendered),
          description: formatedContent.slice(0, 160),
          images: [imageUrl || ''],
        },
      };
    } else {
      console.warn(`Episode not found`);
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  // Return default metadata if episode not found or in case of error
  return {
    title: pageMetaTags.media.title,
    description: pageMetaTags.media.description,
  };
}

export default function EpisodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
