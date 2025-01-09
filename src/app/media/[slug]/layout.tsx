import { Metadata } from 'next';
import { formatedBookContent, toTitleCase } from '@/components/utils/utils';
import {
  defaultMetaTags,
  pageMetaTags,
} from '@/components/utils/config/metaTags';

interface LayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

// Dynamic metadata generation
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const response = await fetch(
      `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=205&orderby=date&order=desc`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch media');
    }

    const media = await response.json();

    // Find the episode by matching the slug
    const episode = media.find((b: { slug: string; }) => b.slug === params.slug);

    if (episode) {
      const { imageUrl, formatedContent } = formatedBookContent(
        episode.content.rendered
      );

      return {
        title: toTitleCase(episode.title.rendered),
        description: formatedContent.slice(0, 160),
        openGraph: {
          title: episode.title.rendered,
          description: formatedContent.slice(0, 160),
          url: `https://blog.ibidunlayiojo.com/media/${params.slug}`,
          images: [{ url: imageUrl || '' }],
          siteName: defaultMetaTags.siteName,
        },
        twitter: {
          card: 'summary_large_image',
          title: episode.title.rendered,
          description: formatedContent.slice(0, 160),
          images: [imageUrl || ''],
        },
      };
    } else {
      console.warn(`Episode with slug "${params.slug}" not found`);
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

export default function EpisodeLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
