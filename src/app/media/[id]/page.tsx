'use client';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';
import { FastAverageColor } from 'fast-average-color';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ImageSet, MediaEpisode, EpisodeColors, MediaShow, StoredEpisodes } from '@/components/utils/types';
import { extractAndRemoveImage, toTitleCase, stripHtml, decodeHtmlEntities, extractYouTubeUrl } from '@/components/utils/utils';

const CACHE_DURATION = 24 * 60 * 60 * 1000;

const imageSets: ImageSet[] = [
  {
    left: '/assets/podsideline1.png',
    right: '/assets/podsideline2.png',
    podcastBgLeft: '/assets/podbg1.png',
    podcastBgRight: '/assets/podbg2.png',
  },
  {
    left: 'assets/podsideliney1.png',
    right: '/assets/podsideliney2.png',
    podcastBgLeft: '/assets/podbgg1.png',
    podcastBgRight: '/assets/podbgg2.png',
  },
];

const MediaEpisodes: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [mediaEp, setMediaEp] = useState<MediaEpisode[]>([]);
  const [episodeColors, setEpisodeColors] = useState<EpisodeColors>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentShow, setCurrentShow] = useState<MediaShow | undefined>();

  // Use useMemo to calculate the image set index and determine if it's a show
  const { currentImageSet, isShow } = useMemo(() => {
    if (!currentShow) {
      return { currentImageSet: imageSets[0], isShow: false };
    }

    const isShow = currentShow.title.endsWith('SHOW');
    const showIndex = isShow
      ? 0
      : Math.abs(currentShow.tagId) % imageSets.length;

    return {
      currentImageSet: imageSets[showIndex],
      isShow,
    };
  }, [currentShow]);

  const fac = useMemo(() => new FastAverageColor(), []);

  const storeEpisodes = useCallback(
    (tagId: number, episodes: MediaEpisode[]) => {
      try {
        const storedEpisodes: StoredEpisodes = JSON.parse(
          localStorage.getItem('mediaEpisodes') || '{}'
        );
        storedEpisodes[tagId] = {
          episodes,
          lastFetched: Date.now(),
        };
        localStorage.setItem('mediaEpisodes', JSON.stringify(storedEpisodes));
      } catch (error) {
        console.error('Error storing episodes:', error);
      }
    },
    []
  );

  const getStoredEpisodes = useCallback(
    (tagId: number): MediaEpisode[] | null => {
      try {
        const storedEpisodes: StoredEpisodes = JSON.parse(
          localStorage.getItem('mediaEpisodes') || '{}'
        );
        const storedData = storedEpisodes[tagId];

        if (
          !storedData ||
          Date.now() - storedData.lastFetched > CACHE_DURATION
        ) {
          return null;
        }

        return storedData.episodes;
      } catch (error) {
        console.error('Error retrieving episodes:', error);
        return null;
      }
    },
    []
  );

  const fetchEpisodesFromAPI = useCallback(
    async (tagId: number): Promise<MediaEpisode[]> => {
      const response = await fetch(
        `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=206&orderby=date&order=desc&tags=${tagId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const episodes = await response.json();
      storeEpisodes(tagId, episodes);
      return episodes;
    },
    [storeEpisodes]
  );

  const getColorFromImage = useCallback(
    async (imageUrl: string, episodeId: number) => {
      if (episodeColors[episodeId]) return; // Skip if color already exists

      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';

        const imageLoadPromise = new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Failed to load image'));
        });

        img.src = `${imageUrl}${
          imageUrl.includes('?') ? '&' : '?'
        }timestamp=${Date.now()}`;

        await imageLoadPromise;

        const color = await fac.getColorAsync(img, {
          algorithm: 'dominant',
          ignoredColor: [255, 255, 255, 255],
        });

        const [r, g, b] = color.value;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (brightness < 30 || brightness > 225) {
          throw new Error('Color too extreme');
        }

        setEpisodeColors((prev) => ({
          ...prev,
          [episodeId]: `rgb(${color.value[0]}, ${color.value[1]}, ${color.value[2]})`,
        }));
      } catch (error) {
        console.error('Error getting color:', error);
        const hue = Math.floor(Math.random() * 360);
        setEpisodeColors((prev) => ({
          ...prev,
          [episodeId]: `hsl(${hue}, 50%, 45%)`,
        }));
      }
    },
    [fac, episodeColors]
  );

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        setLoading(true);
        const showsData = localStorage.getItem('mediaItems');
        if (!showsData) {
          throw new Error('No media items found');
        }

        const shows: MediaShow[] = JSON.parse(showsData);
        const show = shows.find((s) => s.slug === slug);

        if (!show) {
          throw new Error('Show not found');
        }

        setCurrentShow(show);

        const episodes =
          getStoredEpisodes(show.tagId) ||
          (await fetchEpisodesFromAPI(show.tagId));
        setMediaEp(episodes);
      } catch (error) {
        console.error('Error:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to load episodes'
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchShowData();
    }
  }, [slug, fetchEpisodesFromAPI, getStoredEpisodes]);

  useEffect(() => {
    mediaEp.forEach((episode) => {
      const { imageUrl } = extractAndRemoveImage(episode.content.rendered);
      if (imageUrl) {
        getColorFromImage(imageUrl, episode.id);
      }
    });
  }, [mediaEp, getColorFromImage]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-pulse text-lg'>Loading episodes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-red-600 text-lg'>{error}</div>
      </div>
    );
  }

  return (
    <main className='relative w-screen overflow-hidden '>
      {!isShow && (
        <div className='relative'>
          <img
            src={currentImageSet.left}
            alt=''
            className='md:w-20  w-10 absolute md:-start-2 start-0 top-20'
          />
          <img
            src={currentImageSet.right}
            alt=''
            className='md:w-20 w-10 absolute end-0 top-20'
          />
        </div>
      )}

      {isShow && (
        <section
          className='mt-12 min-h-screen bg-center bg-no-repeat bg-cover'
          style={{ backgroundImage: `url('/assets/show-banner.png')` }}
        />
      )}

      <section className='container md:w-[87%] mx-auto relative  p-3 md:p-0'>
        {isShow && currentShow?.title === 'JESUS MOM SHOW' ? (
          <h2 className='text-center font-semibold text-[#2F8668] text-2xl leading-[4.5rem] tracking-wider md:mt-20 mt-10'>
            {currentShow?.title ? toTitleCase(currentShow?.title) : ''}
          </h2>
        ) : (
          <h1 className='text-center md:mt-44 mt-32 mb-14 font-semibold  text-2xl leading-[4.5rem] tracking-wider '>
            {currentShow?.title ? toTitleCase(currentShow?.title) : ''}
          </h1>
        )}

        {isShow && currentShow?.title === 'JESUS MOM SHOW' ? (
          <h1 className='text-2xl text-center mt-6 mb-14 tracking-wider'>
            Equipping Women
          </h1>
        ) : null}

        {mediaEp.map((episode) => {
          const { imageUrl, formatedContent } = extractAndRemoveImage(
            episode.content.rendered
          );

          const shortDescription = stripHtml(formatedContent).slice(0, 150);

          if (!imageUrl) return null;

          return (
            <>
              {/* <MetaTags
                title={toTitleCase(currentShow?.title || 'Media')}
                description={shortDescription}
                image={imageUrl || '../assets/logo.png'}
                type='article'
                siteName='Ibidun Layi Ojo'
                canonicalUrl={`${window.location.origin}/media/${currentShow?.tagId}}`}
              /> */}
              <div
                key={episode.id}
                className='rounded-2xl text-white md:p-10  mb-6 transition-colors duration-300 hover:shadow-lg my-14 md:bg-transparent bg-white p-5 md:shadow-none shadow-[0_4px_8px_rgba(0,0,0,0.1)]'
                style={{
                  backgroundColor:
                    episodeColors[episode.id] || 'rgb(75, 85, 99)',
                }}>
                <div className='relative overflow-hidden rounded-lg '>
                  <img
                    src={imageUrl}
                    alt='Episode thumbnail'
                    className='md:w-full h-[16rem] md:h-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300'
                    // onError={(e) => {
                    //   const target = e.target as HTMLImageElement;
                    //   target.src = heroImage;
                    // }}
                  />
                </div>
                <div className='mt-6'>
                  {/* <time className='text-sm opacity-80'>
                    {new Date(episode.date).toLocaleDateString()}
                  </time> */}
                  <h2 className='font-semibold mt-3 text-xl'>
                    {decodeHtmlEntities(episode.title.rendered)}
                  </h2>
                  <p className='mt-4 opacity-90 leading-relaxed text-lg'>
                    {stripHtml(formatedContent)}
                  </p>
                  <Link
                    target='_blank'
                    href={extractYouTubeUrl(formatedContent)}
                    className='mt-6 rounded-lg border-2 border-white text-sm px-6 py-2 flex items-center space-x-2 hover:bg-white hover:text-black transition-colors duration-30 object-contain w-fit mb-5 md:mb-0'>
                    <FaPlay className='mr-2' />
                    <span>Play Episode</span>
                  </Link>
                </div>
              </div>
            </>
          );
        })}
        <div className='flex justify-center'>
          <Link
            target='_blank'
            href={currentShow?.link as string}
            className=' text-sm py-3 px-6 mb-20 mt-14 border-2 border-black object-contain'>
            See More Episodes
          </Link>
        </div>
      </section>

      {!isShow && (
        <div className='relative'>
          <img
            src={currentImageSet.podcastBgLeft}
            alt=''
            className='w-20 md:w-36 absolute start-0 md:-bottom-20 -bottom-5'
          />
          <img
            src={currentImageSet.podcastBgRight}
            alt=''
            className='w-12 md:w-24 absolute end-0 md:-bottom-20 -bottom-5'
          />
        </div>
      )}
    </main>
  );
};

export default MediaEpisodes;
