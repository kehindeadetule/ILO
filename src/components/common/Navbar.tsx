'use client';
import { Disclosure, Menu } from '@headlessui/react';
import { FaChevronDown, FaX } from 'react-icons/fa6';
import { linkData, linkDataMobile } from './navbarData';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { MediaItemProps } from '../utils/types';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isHomeOrShowPage = pathname === '/' || pathname === '/shows';

  const isActiveLink = useCallback(
    (url: string) => {
      if (url === '/') {
        return pathname === url;
      }
      return pathname.startsWith(url);
    },
    [pathname]
  );

  const handleHomeClick = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > window.innerHeight;
      setScrolled(isScrolled);
    };

    if (isHomeOrShowPage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomeOrShowPage]);

  const fetchMediaItems = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(
        'https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=205&orderby=date&order=desc'
      );
      const mediaData = await response.json();

      const processedItems = await Promise.all(
        mediaData.map(
          async (item: {
            slug: string;
            title: { rendered: string };
            content: { rendered: string };
          }) => {
            const tagResponse = await fetch(
              `https://blog.ibidunlayiojo.com/wp-json/wp/v2/tags?slug=${item.slug}`
            );
            const tagData = await tagResponse.json();
            const tagId = tagData.length > 0 ? tagData[0].id : null;

            return {
              title: item.title.rendered,
              url: `/media/${item.slug}`,
              tagId: tagId,
              slug: item.slug,
              link: item.content.rendered,
            };
          }
        )
      );

      setMediaItems(processedItems);
      localStorage.setItem('mediaItems', JSON.stringify(processedItems));
    } catch (error) {
      console.error('Error fetching media items:', error);
      setError(error instanceof Error ? error.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    const cachedMediaItems = localStorage.getItem('mediaItems');
    if (cachedMediaItems) {
      try {
        setMediaItems(JSON.parse(cachedMediaItems));
      } catch (error) {
        console.error('Error parsing cached media items:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to load Blog post'
        );
        localStorage.removeItem('mediaItems');
      }
    } else {
      fetchMediaItems();
    }
  }, [fetchMediaItems]);

  const handleMediaDropdownClick = useCallback(() => {
    if (mediaItems.length === 0) {
      fetchMediaItems();
    }
  }, [mediaItems.length, fetchMediaItems]);

  const navbarClass = isHomeOrShowPage
    ? `z-20 fixed w-full transition-all duration-300 ${
        scrolled ? 'bg-white md:shadow-lg' : 'bg-transparent'
      }`
    : 'z-20 fixed w-full bg-white md:shadow-lg';

  return (
    <Disclosure as='nav' className={navbarClass}>
      {({ open, close }) => (
        <>
          {open && (
            <div
              className='fixed inset-0 bg-black/10 backdrop-blur-sm z-0'
              onClick={() => close()}
            />
          )}

          <section className='container lg:w-[91%] md:w-[96%] mx-auto'>
            <div className='px-3 md:px-0'>
              <div className='relative flex h-20 items-center justify-between'>
                <div className='flex flex-1 items-center'>
                  <Link href='/' onClick={handleHomeClick}>
                    <Image
                      className='md:h-16 h-14 w-auto my-1'
                      src='/assets/logo.png'
                      alt='flowing rivers logo'
                      width={64}
                      height={64}
                    />
                  </Link>
                </div>

                <div className='flex items-center sm:hidden'>
                  <Disclosure.Button className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white z-20'>
                    <span className='absolute -inset-0.5' />
                    <span className='sr-only'>Open main menu</span>
                    {open ? (
                      <FaX
                        className='block h-8 w-8 border-0'
                        color='#555555'
                        aria-hidden='true'
                      />
                    ) : (
                      <HiOutlineMenuAlt3
                        className='block h-8 w-8'
                        color='#555555'
                        aria-hidden='true'
                      />
                    )}
                  </Disclosure.Button>
                </div>

                <div className='hidden sm:ml-6 sm:block'>
                  <div className='flex space-x-4'>
                    {linkData.map((link, index) => (
                      <ul className='nav-item' key={index}>
                        {link.dropdown ? (
                          <Menu
                            as='div'
                            className='relative inline-block text-left'>
                            <Menu.Button
                              className={`font-semibold mx-3 link flex items-center ${
                                isHomeOrShowPage && !scrolled
                                  ? 'text-[#555555]'
                                  : ''
                              } ${
                                isActiveLink(link.url)
                                  ? 'text-[#2F8668]'
                                  : 'text-[#555555]'
                              }`}
                              onClick={handleMediaDropdownClick}>
                              {link.title}
                              <FaChevronDown className='ml-1 w-2.5' />
                            </Menu.Button>
                            <Menu.Items className='absolute right-0 mt-2 w-52 origin-top-right bg-white shadow-lg rounded-xl py-2 ring-1 ring-black ring-opacity-5 focus:outline-none'>
                              {loading ? (
                                <div className='px-4 py-2 text-xs'>
                                  Loading...
                                </div>
                              ) : error ? (
                                <div className='flex justify-center items-center min-h-screen'>
                                  <div className='text-red-600 text-lg'>
                                    {error}
                                  </div>
                                </div>
                              ) : (
                                mediaItems.map((item, itemIndex) => (
                                  <Menu.Item key={itemIndex}>
                                    {({ active }) => (
                                      <Link
                                        href={item.url}
                                        className={`${
                                          active
                                            ? 'text-[#2F8668]'
                                            : 'text-[#555555]'
                                        } block px-4 py-2 text-xs`}>
                                        {item.title}
                                      </Link>
                                    )}
                                  </Menu.Item>
                                ))
                              )}
                            </Menu.Items>
                          </Menu>
                        ) : (
                          <Link
                            href={link.url}
                            className={`font-semibold mx-3 link ${
                              isHomeOrShowPage && !scrolled
                                ? 'text-[#555555]'
                                : ''
                            } ${
                              isActiveLink(link.url)
                                ? 'text-[#2F8668]'
                                : 'text-[#555555]'
                            }`}>
                            {link.title}
                          </Link>
                        )}
                      </ul>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className='z-50'>
              <div className='space-y-10 px-2 pb-3 pt-32 h-screen text-[#555555] drop-shadow-2xl w-2/3 end-0 top-0 absolute bg-white disclosure'>
                {linkDataMobile.map((link, index) => (
                  <ul key={index}>
                    {link.dropdown ? (
                      <Disclosure>
                        <Disclosure.Button className='font-semibold mx-3 text-md link hover:text-[#2F8668] hover:underline hover:underline-offset-4 pl-4'>
                          {link.title}
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          {mediaItems.map((item, itemIndex) => (
                            <Link
                              key={itemIndex}
                              href={item.url}
                              onClick={() => close()}
                              className={`block ml-7 font-semibold my-5 px-2 py-2 text-sm hover:text-[#2F8668] ${
                                isActiveLink(item.url)
                                  ? 'bg-slate-100 rounded-lg text-[#2F8668]'
                                  : 'text-[#555555]'
                              }`}>
                              {item.title}
                            </Link>
                          ))}
                        </Disclosure.Panel>
                      </Disclosure>
                    ) : (
                      <Link
                        href={link.url}
                        className={`font-semibold mx-3 text-md link hover:text-[#2F8668] hover:underline hover:underline-offset-4 pl-4 ${
                          isActiveLink(link.url)
                            ? 'bg-slate-100 pr-20 pl-5 py-3.5 h-20 rounded-3xl text-[#2F8668]'
                            : ''
                        }`}
                        onClick={() => close()}>
                        {link.title}
                      </Link>
                    )}
                  </ul>
                ))}
              </div>
            </Disclosure.Panel>
          </section>
        </>
      )}
    </Disclosure>
  );
}
