// import Helmet from '@/components/utils/config/Helmet';
import Head from 'next/head';

// export const metadata = {
//   title: 'About | Ibidun Layi Ojo',
//   description:
//     'Learn more about Ibidun Layi Ojo, my journey, experiences, and what drives me.',
//   image: '/assets/about-banner.png',
//   type: 'website',
// };

const AboutUs = () => {
  return (
    <>
      {/* <Helmet pageKey='about' /> */}
      <Head>
        <title>About | Ibidun Layi Ojo</title>
        <meta
          name='description'
          content='Learn more about Ibidun Layi Ojo, my journey, experiences, and what drives me.'
        />

        {/* Open Graph meta tags */}
        <meta property='og:title' content='About | Ibidun Layi Ojo' />
        <meta
          property='og:description'
          content='Learn more about Ibidun Layi Ojo, my journey, experiences, and what drives me.'
        />
        <meta
          property='og:image'
          content='https://ilo-m8j1.vercel.app/assets/about-banner.png'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://ilo-m8j1.vercel.app/about' />

        {/* Twitter meta tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='About | Ibidun Layi Ojo' />
        <meta
          name='twitter:description'
          content='Learn more about Ibidun Layi Ojo, my journey, experiences, and what drives me.'
        />
        <meta
          name='twitter:image'
          content='https://ilo-m8j1.vercel.app/assets/about-banner.png'
        />
      </Head>
      
      <section>
        <div className='grid md:grid-cols-2'>
          <div className='block md:hidden mt-28'>
            <h2 className='text-[#2F8668] font-medium tracking-wider my-8 text-xl text-center'>
              MEET IBIDUN
            </h2>
            <h1 className='text-center text-2xl mt-8 mb-10 tracking-wider leading-[4.5rem]'>
              Passionate Jesus <br className='block md:hidden' /> Girl
            </h1>
          </div>
          <div className='md:mt-20'>
            <img src='/assets/about-banner.png' alt='' />
          </div>
          <div className='md:bg-[#FFF8F5] p-3 md:p-0 '>
            <div className='md:w-4/5 mx-auto text-lg'>
              <div className='hidden md:block mt-36'>
                <h2 className='text-[#2F8668] font-medium tracking-wider my-8 text-xl text-center'>
                  MEET IBIDUN
                </h2>
                <h1 className='text-center text-2xl mt-10 mb-14  tracking-wider'>
                  Passionate Jesus Girl
                </h1>
              </div>
              <p className='my-6'>
                Hi, I’m <strong>Ibidun</strong>. Welcome to Flowing Rivers!
              </p>
              <p className='my-6'>
                It would be great to meet you in person, but until then, here is
                a little about me:
              </p>
              <p className='my-6 '>
                The most important thing you need to know about me is that I am
                a passionate Jesus girl.
              </p>
              <p className='my-6'>
                I am married to Layi (the most awesome guy on earth!). He is the
                greatest blessing of God in my life. He thrills me and makes me
                do the “Wow… Thank you Jesus” happy dance! God has blessed our
                marriage with priceless treasures. I am a Psychologist and
                Psychometrician by training. We live in beautiful Maryland, USA.
              </p>
              <p className='my-6'>
                Words are my favorite things- I really enjoy writing and reading
                good books. Once I start a good book, I find it hard to put it
                down till I read the last word. Growing up, I remember hiding in
                the closet or crawling under the blanket in my room to finish a
                book undisturbed. Today, my favorite hideout in our house is
                still the library. When I am not being a wife or a mom, I am
                writing; and when I am not writing, I am reading. If you have a
                good book – let’s connect.
              </p>
              <p className='my-6'>
                As you go through the pages of Flowing Rivers, my prayer is that
                you will find something that will encourage you to live to the
                fullest and be all that God created you to be.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
