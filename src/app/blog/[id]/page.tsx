'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import parse from 'html-react-parser';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { useFetchBlogs } from '@/components/api/useFetchBlogs';
import CustomAlert from '@/components/utils/CustomAlert';
import CircleLoader from '@/components/utils/Loader';
import {
  extractAndRemoveImage,
  decodeHtmlEntities,
  truncateString,
  toTitleCase,
  stripHtml,
} from '@/components/utils/utils';
import Link from 'next/link';
import Comments from '@/components/blog/Comment';
interface Blog {
  id: number | string;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  excerpt: { rendered: string };
}

const BlogPost: React.FC = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const router = useRouter();
  const [prevBlog, setPrevBlog] = useState<Blog | null>(null);
  const [nextBlog, setNextBlog] = useState<Blog | null>(null);

  const { blogs, loading, error } = useFetchBlogs({ per_page: 12 });

  useEffect(() => {
    if (blogs.length > 0) {
      const singleBlog = blogs.find((b) => b.id.toString() === id);
      if (singleBlog) {
        setBlog(singleBlog);
        const currentIndex = blogs.findIndex((b) => b.id.toString() === id);
        if (currentIndex > 0) {
          setPrevBlog(blogs[currentIndex - 1]);
        } else {
          setPrevBlog(null);
        }
        if (currentIndex < blogs.length - 1) {
          setNextBlog(blogs[currentIndex + 1]);
        } else {
          setNextBlog(null);
        }
      }
    }
  }, [blogs, id]);

  // Null check added before destructuring
  const { imageUrl, formatedContent } = blog
    ? extractAndRemoveImage(blog.content.rendered)
    : { imageUrl: null, formatedContent: '' };

  const handlePrevious = () => {
    if (prevBlog) {
      router.push(`/blog/${prevBlog.id}`);
      window.scroll(0, 0);
    } else {
      router.push('/blog');
      window.scroll(0, 0);
    }
  };

  const handleNext = () => {
    if (nextBlog) {
      router.push(`/blog/${nextBlog.id}`);
      window.scroll(0, 0);
    }
  };

  return (
    <>
      {loading ? (
        <div className='flex justify-center items-center min-h-[50vh]'>
          <CircleLoader />
        </div>
      ) : error ? (
        <div className='col-span-full flex justify-center items-center min-h-[50vh]'>
          <CustomAlert variant='error'>{error} Blog post</CustomAlert>
        </div>
      ) : !blog ? (
        <div>Blog not found</div>
      ) : (
        <article className='container mx-auto px-4 py-8 mb-20'>
          <Link
            href='/blog'
            className='hover:underline mb-4 inline-block mt-20'>
            &larr; Back to all blogs
          </Link>
          <div className=''>
            <h2 className='text-2xl font-bold mb-2 text-center'>
              {decodeHtmlEntities(blog.title.rendered)}
            </h2>
            <span className='text-gray-500 mb-8 block text-center'>
              {new Date(blog.date).toLocaleDateString()}
            </span>
            {imageUrl && (
              <img
                src={imageUrl}
                alt={blog.title.rendered}
                className='w-full max-w-2xl mx-auto mb-5 rounded-md'
              />
            )}
            <div className='w-full max-w-2xl mx-auto text-xl space-y-5'>
              {parse(formatedContent)}
            </div>
          </div>

          {/* comment section */}
          <section className='mt-12 md:mb-32 mb-20'>
            <Comments postId={id as string} postDate={blog.date} />
          </section>

          <div className='md:flex justify-between md:mt-16 grid gap-y-10'>
            <button
              onClick={handlePrevious}
              className='hover:underline text-[#2F8668] flex'
              // disabled={!prevBlog}
            >
              {prevBlog ? (
                <>
                  <IoIosArrowBack className='my-auto text-black' />{' '}
                  {truncateString(
                    decodeHtmlEntities(toTitleCase(prevBlog.title.rendered)),
                    25
                  )}
                </>
              ) : (
                'Back to Blog'
              )}
            </button>
            <button
              onClick={handleNext}
              className='hover:underline text-[#2F8668] flex'
              disabled={!nextBlog}>
              {nextBlog ? (
                <>
                  {truncateString(
                    decodeHtmlEntities(toTitleCase(nextBlog.title.rendered)),
                    25
                  )}
                  <IoIosArrowForward className='my-auto text-black' />
                </>
              ) : (
                'Next'
              )}
            </button>
          </div>
        </article>
      )}
    </>
  );
};

export default BlogPost;
