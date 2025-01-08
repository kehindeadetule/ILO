// import blogBg from '../assets/blog.png';
'use client';
import { useFetchBlogs } from '../api/useFetchBlogs';
import {
  decodeHtmlEntities,
  extractAndRemoveImage,
  stripHtml,
} from '../utils/utils';
import CircleLoader from '../utils/Loader';
import CustomAlert from '../utils/CustomAlert';
import Link from 'next/link';

const Blog = () => {
  const {
    blogs: blog,
    loading,
    error,
  } = useFetchBlogs({
    orderby: 'date',
    order: 'desc',
    per_page: 12,
    page: 1,
  });

  const latestBlogs = blog.slice(0, 3);

  return (
    <main className='h-auto mb-16 md:mb-[20rem]'>
      <section
        className='mt-10 '
        style={{
          backgroundImage: `url(/assets/blog.png)`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '70vh',
        }}>
        <div className='mt-14 md:-mb-[16rem]'>
          <h1 className='text-2xl mb-20'>Recent Blogs</h1>
          <div className='grid md:grid-cols-3 container md:w-[96%] mx-auto mt-10 md:p-0 p-5 gap-y-10'>
            {loading ? (
              <div>
                <CircleLoader />
              </div>
            ) : error ? (
              <div className='col-span-3 w-full  min-h-scree'>
                <CustomAlert variant='error'>{error} Blog post</CustomAlert>
              </div>
            ) : (
              latestBlogs.map((blog) => {
                const { imageUrl } = extractAndRemoveImage(
                  blog.content.rendered
                );

                return (
                  <div key={blog.id}>
                    <div className='md:bg-transparent bg-white p-5 md:p-0 md:shadow-none shadow-[0_4px_8px_rgba(0,0,0,0.1)]  rounded-2xl'>
                      <Link href={`/blog/${blog.id}`}>
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={`blog${blog.id}`}
                            className='md:w-80 md:h-80 h-[16rem] mx-auto md:rounded-sm rounded-lg'
                          />
                        )}
                        <div className='md:w-2/3 mx-auto mt-3 text-lg'>
                          <small>
                            {new Date(blog.date).toLocaleDateString()}
                          </small>
                          <h2 className='font-semibold md:text-lg text-xl my-2'>
                            {decodeHtmlEntities(blog.title.rendered).slice(
                              0,
                              27
                            )}
                          </h2>
                          <p className='mb-10 text-lg'>
                            {stripHtml(
                              decodeHtmlEntities(blog.excerpt.rendered)
                            ).slice(0, 72)}
                            ...
                          </p>
                          <span className='md:text-xs text-lg font-medium underline underline-offset-4 md:text-black text-[#2F8668]'>
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
        </div>
      </section>
    </main>
  );
};

export default Blog;
