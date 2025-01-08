'use client';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
// import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { FastAverageColor } from 'fast-average-color';

import {
  extractAndRemoveImage,
  decodeHtmlEntities,
  stripHtml,
  extractYouTubeUrl,
  getDominantColor,
} from '../utils/utils';

import { MediaEpisode, EpisodeColors } from '../utils/types';
import CustomAlert from '../utils/CustomAlert';
import CircleLoader from '../utils/Loader';
import Link from 'next/link';

const CACHE_DURATION = 24 * 60 * 60 * 1000;

const LatestPodcasts: React.FC = () => {
  const [mediaEp, setMediaEp] = useState<MediaEpisode[]>([]);
  const [episodeColors, setEpisodeColors] = useState<EpisodeColors>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the FastAverageColor instance
  const fac = useMemo(() => new FastAverageColor(), []);

  const storeEpisodes = useCallback((episodes: MediaEpisode[]) => {
    try {
      localStorage.setItem(
        'latestEpisodes',
        JSON.stringify({
          episodes,
          lastFetched: Date.now(),
        })
      );
    } catch (error) {
      console.error('Error storing episodes:', error);
    }
  }, []);

  const getStoredEpisodes = useCallback((): MediaEpisode[] | null => {
    try {
      const storedData = JSON.parse(
        localStorage.getItem('latestEpisodes') || '{}'
      );
      if (
        !storedData.episodes ||
        Date.now() - storedData.lastFetched > CACHE_DURATION
      ) {
        return null;
      }
      return storedData.episodes;
    } catch (error) {
      console.error('Error retrieving episodes:', error);
      return null;
    }
  }, []);

  const fetchEpisodesFromAPI = useCallback(async (): Promise<
    MediaEpisode[]
  > => {
    const response = await fetch(
      'https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=206&orderby=date&order=desc&per_page=2'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const episodes = await response.json();
    storeEpisodes(episodes);
    return episodes;
  }, [storeEpisodes]);

  useEffect(() => {
    const fetchLatestEpisodes = async () => {
      try {
        setLoading(true);
        const episodes = getStoredEpisodes() || (await fetchEpisodesFromAPI());
        setMediaEp(episodes.slice(0, 2));
      } catch (error) {
        console.error('Error:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to load episodes'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEpisodes();
  }, [fetchEpisodesFromAPI, getStoredEpisodes]);

  const fetchColorForEpisode = useCallback(
    async (imageUrl: string, episodeId: number) => {
      if (episodeColors[episodeId]) return; // Skip if color is already set

      try {
        const color = await getDominantColor(imageUrl);
        setEpisodeColors((prev) => ({ ...prev, [episodeId]: color }));
      } catch (error) {
        console.error('Error fetching color:', error);
        setEpisodeColors((prev) => ({ ...prev, [episodeId]: '#245852' })); // Fallback color
      }
    },
    [episodeColors]
  );
  useEffect(() => {
    mediaEp.forEach((episode) => {
      const { imageUrl } = extractAndRemoveImage(episode.content.rendered);
      if (imageUrl) {
        fetchColorForEpisode(imageUrl, episode.id);
      }
    });
  }, [mediaEp, fetchColorForEpisode]);

  return (
    <>
      <section className='relative w-[100vw] min-h-screen overflow-hidden'>
        <div className='md:block hidden'>
          <img
            src='/assets/side.png'
            alt=''
            className='w-[4rem] absolute start-0 top-0'
          />
          <img
            src='/assets/side.png'
            alt=''
            className='w-[4rem] absolute end-2 top-0'
          />
        </div>
        <section className='container md:w-[87%] mx-auto relative p-3 md:p-0'>
          <h1 className='text-2xl text-center mt-12 mb-14'>Latest Podcasts</h1>
          {loading ? (
            <div>
              <CircleLoader />
            </div>
          ) : error ? (
            <div className='flex justify-center items-center'>
              <CustomAlert variant='error'>
                {error} Lastest Podcasts
              </CustomAlert>
            </div>
          ) : (
            mediaEp.map((episode, index) => {
              const { imageUrl, formatedContent } = extractAndRemoveImage(
                episode.content.rendered
              );
              if (!imageUrl) return null;

              return (
                <div
                  key={episode.id}
                  className={`rounded-2xl text-white md:p-10 p-5 ${
                    index === 1 ? 'mt-12' : ''
                  }`}
                  style={{
                    backgroundColor:
                      episodeColors[episode.id] ||
                      (index === 0 ? '#245852' : '#401C03'),
                  }}>
                  <img
                    src={imageUrl}
                    alt={`podcast ${index + 1}`}
                    height='auto'
                    width='auto'
                    className='w-full h-[16rem] md:h-full '
                  />
                  <div>
                    <h2 className='font-semibold mt-3'>
                      {decodeHtmlEntities(episode.title.rendered)}
                    </h2>
                    <p className='mt-2'>{stripHtml(formatedContent)}</p>
                    <Link
                      href={extractYouTubeUrl(formatedContent)}
                      target='_blank'
                      className='mt-3 rounded-2xl border-2 border-white text-xs px-5 py-1.5 flex items-center space-x-2 w-fit'>
                      <span>
                        <FaPlay />
                      </span>
                      <span>Play Episode</span>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </section>
        <div className='md:block hidden'>
          <img
            src='/assets/side.png'
            alt=''
            className='w-[4rem] absolute start-0 -bottom-2'
          />
          <img
            src='/assets/side.png'
            alt=''
            className='w-[4rem] absolute end-2 -bottom-2'
          />
        </div>
      </section>
      <section className='mt-20'>
        <img src='/assets/footerBg.png' alt='footer' />
      </section>
    </>
  );
};

export default LatestPodcasts;
