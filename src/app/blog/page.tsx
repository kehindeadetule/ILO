'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useFetchBlogs } from '@/components/api/useFetchBlogs';
import CustomAlert from '@/components/utils/CustomAlert';
import CircleLoader from '@/components/utils/Loader';
import Pagination from '@/components/utils/Pagination';
import {
  extractAndRemoveImage,
  decodeHtmlEntities,
  toTitleCase,
  stripHtml,
} from '@/components/utils/utils';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const { blogs, error, loading, totalPages } = useFetchBlogs({
    orderby: 'date',
    order: 'desc',
    per_page: postsPerPage,
    page: currentPage,
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <section className='relative p-5 md:p-0'>
        <main className='md:pt-40 pt-28'>
          <div>
            <img
              src='/assets/side.png'
              alt=''
              className='md:w-[5rem] w-12 absolute -start-2 top-20'
            />
            <img
              src='/assets/side.png'
              alt=''
              className='md:w-[5rem] w-12 absolute end-0 top-20'
            />
          </div>
          <section className='container md:w-[87%] mx-auto relative'>
            <h1 className='text-2xl text-center mt-6 mb-14 leading-[4.5rem] tracking-wider'>
              Flowing Rivers <br className='block md:hidden ' /> Blog
            </h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 container md:w-[96%] mx-auto md:mt-20 mt-14 text-center mb-12'>
              {loading ? (
                <CircleLoader />
              ) : error ? (
                <div className='col-span-full flex justify-center items-center min-h-[50vh]'>
                  <CustomAlert variant='error'>{error} Blogs</CustomAlert>
                </div>
              ) : (
                blogs.map((post) => {
                  const { imageUrl } = extractAndRemoveImage(
                    post.content.rendered
                  );

                  return (
                    <div key={post.id}>
                      <div className='md:bg-transparent bg-white p-5 md:p-0 md:shadow-none shadow-[0_4px_8px_rgba(0,0,0,0.1)]  rounded-2xl'>
                        <Link href={`/blog/${post.id}`}>
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={`blog${post.id}`}
                              className='md:w-80 md:h-80 w-full h-64  mx-auto md:rounded-sm rounded-xl'
                            />
                          )}
                          <div className='md:w-2/3 mx-auto mt-3'>
                            <small className='text-md'>
                              {new Date(post.date).toLocaleDateString()}
                            </small>
                            <h2 className='font-semibold md:text-lg text-xl my-2'>
                              {decodeHtmlEntities(
                                toTitleCase(post?.title.rendered)
                              )}
                            </h2>
                            <p className='mb-10 text-lg'>
                              {stripHtml(
                                decodeHtmlEntities(post.excerpt.rendered)
                              )}
                            </p>
                            <span className='md:text-xs font-medium underline underline-offset-4 md:text-black text-[#2F8668]'>
                              READ MORE
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {!loading && blogs.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            <div className='pt-12 md:mb-0'>
              <img
                src='/assets/side.png'
                alt=''
                className='md:w-[5rem] w-[3rem] absolute md:-start-24 start-0 bottom-0'
              />
              <img
                src='/assets/side.png'
                alt=''
                className='md:w-[5rem] w-[3rem] absolute md:-end-16 end-0 bottom-0 z-0'
              />
            </div>
          </section>
        </main>
      </section>
    </>
  );
};

export default Blog;
