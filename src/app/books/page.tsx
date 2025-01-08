'use client';
import { useState } from 'react';
import { useFetchBooks } from '@/components/api/useFetchBooks';
import CustomAlert from '@/components/utils/CustomAlert';
import CircleLoader from '@/components/utils/Loader';
import Pagination from '@/components/utils/Pagination';
import {
  formatedBookContent,
  decodeHtmlEntities,
} from '@/components/utils/utils';
import Link from 'next/link';
import Helmet from '@/components/utils/config/Helmet';

const Books = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const { books, loading, error, totalBooks } = useFetchBooks({
    orderby: 'date',
    order: 'desc',
    per_page: postsPerPage,
    page: currentPage,
  });

  const totalPages = Math.ceil(totalBooks / postsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Helmet pageKey='books' />

      <section className='relative'>
        <main className='md:pt-36 pt-28'>
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
          <section className='container md:w-[87%] mx-auto relative text-center'>
            <h2 className='text-[#2F8668] font-semibold text-xl mt-8'>
              BEST SELLING CHRISTIAN READS{' '}
            </h2>
            <h1 className='text-2xl mt-10 md:mb-14 leading-[4.5rem] tracking-wider'>
              Ibidun Layi-Ojo <br className='block md:hidden' /> Books
            </h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container md:w-[96%] mx-auto md:my-20 mt-14 mb-20 text-center md:p-0 p-5'>
              {loading ? (
                <CircleLoader />
              ) : error ? (
                <div className='col-span-full flex justify-center items-center min-h-[50vh]'>
                  <CustomAlert variant='error'>{error} Books</CustomAlert>
                </div>
              ) : (
                books.map((book) => {
                  const { imageUrl } = formatedBookContent(
                    book.content.rendered
                  );
                  console.log(imageUrl, 'extedd');
                  return (
                    <div
                      key={book.id}
                      className='md:bg-transparent bg-white p-5 md:p-0 md:shadow-none shadow-[0_4px_8px_rgba(0,0,0,0.1)] rounded-xl'>
                      <Link href={`/books/${book.id}`}>
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={`books${book.id}`}
                            className='w-full h-auto object-contain mx-auto rounded-lg'
                          />
                        )}
                        <div className='w-2/3 mx-auto mt-3'>
                          <h6 className='font-semibold my-4 text-xl'>
                            {decodeHtmlEntities(book.title.rendered)}
                          </h6>
                          <span className='text-[#2F8668] font-medium underline underline-offset-4 py-5'>
                            READ MORE
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
            {!loading && books.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </section>
        </main>
      </section>
    </>
  );
};

export default Books;
