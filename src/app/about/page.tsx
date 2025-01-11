import {
  pageMetaTags,
  defaultMetaTags,
} from '@/components/utils/config/metaTags';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: pageMetaTags.about.title,
  description: pageMetaTags.about.description,
  openGraph: {
    title: pageMetaTags.about.title,
    description: pageMetaTags.about.description,
    url: 'https://blog.ibidunlayiojo.com/about',
    images: [{ url: pageMetaTags.about.image }],
    siteName: defaultMetaTags.siteName,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const AboutUs = () => {
  return (
    <>
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
