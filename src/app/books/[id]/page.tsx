'use client';
import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { useFetchBooks } from '@/components/api/useFetchBooks';
import CustomAlert from '@/components/utils/CustomAlert';
import CircleLoader from '@/components/utils/Loader';
import {
  formatedBookContent,
  decodeHtmlEntities,
} from '@/components/utils/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Book {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  excerpt: { rendered: string };
}

const BookPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);

  const { books, loading, error } = useFetchBooks({
    per_page: 12,
    orderby: 'date',
    order: 'desc',
  });

  useEffect(() => {
    if (books.length > 0 && id) {
      const foundBook = books.find((p) => p.id.toString() === id);
      if (foundBook) {
        setBook(foundBook);
      }
    }
  }, [books, id]);

  const { imageUrl, formatedContent, amazonUrl } = book
    ? formatedBookContent(book.content.rendered)
    : { imageUrl: null, formatedContent: '', amazonUrl: '' };

  return (
    <section className='relative'>
      <div>
        <img
          src='/assets/book-sideline-l.png'
          alt=''
          className='md:w-1/4 w-1/3 absolute -start-2 top-20'
        />
        <img
          src='/assets/book-sideline-r.png'
          alt=''
          className='md:w-1/4 w-1/3 absolute end-0 top-20'
        />
      </div>
      {loading ? (
        <div className='flex justify-center items-center min-h-[50vh]'>
          <CircleLoader />
        </div>
      ) : error ? (
        <div className='col-span-full flex justify-center items-center min-h-[50vh]'>
          <CustomAlert variant='error'>{error} Books</CustomAlert>
        </div>
      ) : !book ? (
        <div>Blog not found</div>
      ) : (
        <article className='container mx-auto px-4 py-8 relative md:pt-24 pt-20'>
          <Link
            href='/books'
            className='hover:underline mb-4 inline-block mt-20'>
            &larr; Back to all books
          </Link>
          <div className=''>
            <h2 className='text-3xl font-bold mb-2 text-center'>
              {decodeHtmlEntities(book.title.rendered)}
            </h2>
            <span className='text-gray-500 mb-8 block text-center'>
              {new Date(book.date).toLocaleDateString()}
            </span>
            {imageUrl && (
              <img
                src={imageUrl}
                alt={book.title.rendered}
                className='w-full md:w-5/12 h-5/12 mx-auto mb-5 rounded-md'
              />
            )}
            <div className='w-full md:w-5/12 mx-auto text-xl space-y-5'>
              {parse(formatedContent)}
            </div>
          </div>

          <Link
            target='_blank'
            href={amazonUrl as string || ''}
            className='text-sm md:py-2.5 py-3 text-white px-12 md:my-24 mt-14 mb-20 flex justify-center md:w-1/5 w-1/2 mx-auto bg-black object-contain'>
            BUY NOW
          </Link>
        </article>
      )}
      <div className=''>
        <img
          src='/assets/podbgg1.png'
          alt=''
          className='w-[6rem] absolute start-0 bottom-0'
        />
        <img
          src='/assets/podbgg2.png'
          alt=''
          className='w-[3.5rem] absolute end-0 bottom-0'
        />
      </div>
    </section>
  );
};

export default BookPost;
