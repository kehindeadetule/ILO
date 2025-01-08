import Link from 'next/link';

const Message = () => {
  return (
    <main className='h-[100vh] relative grid items-center w-screen'>
      {/* Background image container */}
      <div
        className='absolute inset-0 -z-5 md:mt-36'
        style={{
          backgroundImage: `url(/assets/blog.png)`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          maxHeight: '60vh',
        }}></div>

      {/* Card container */}
      <section className='flex flex-col items-center justify-center min-h-[70vh] p-5 md:p-0 z-10'>
        <div className='shadow-[0_1px_12px_rgba(0,0,0,0.2)] rounded-2xl text-center md:max-w-2xl mx-auto my-auto md:p-10 py-10 px-5 bg-white'>
          <h2 className='text-2xl text-[#2F8668] font-semibold'>
            MESSAGE RECEIVED WITH LOVE
          </h2>
          <p className='text-lg mt-4 mb-8'>
            Thank you for reaching out! Your message has been received with
            love. We will get back to you as soon as possible. In the meantime,
            feel free to explore recent blog post and let’s connect on social
            media!
          </p>

          <Link
            href='/blog'
            className='rounded-sm md:py-2.5 py-3 text-white my-5 flex justify-center md:w-2/3 w-2/3 mx-auto bg-black'>
            Read recent blog post
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Message;
