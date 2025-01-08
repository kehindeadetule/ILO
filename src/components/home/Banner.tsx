'use client';
import { useState } from 'react';
import AnimationLoader from '../utils/IntroAnimation';

const Banner = () => {
  const [showAnimation, setShowAnimation] = useState(true);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };
  return (
    <main>
      {showAnimation && (
        <AnimationLoader onComplete={handleAnimationComplete} />
      )}
      {/* desktop view */}
      <div className='md:block hidden'>
        <section
          className='relative md:block hidden'
          style={{
            backgroundImage: `url(/assets/banner-img.png)`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'bottom',
            alignItems: 'bottom',
            textAlign: 'start',
            minHeight: '100vh',
          }}>
          <div className='absolute bottom-24 start-32'>
            <h1 className='text-4xl mt-6 mb-14'>Ibidun Layi-Ojo</h1>
            <p className='font-bold text-lg tracking-wider'>
              The most important thing you need to <br /> know about me is that
              I am a Jesus girl.
            </p>
          </div>
        </section>
      </div>
      {/* mobile view */}
      <section className='block md:hidden pt-32'>
        <div className='text-center mb-10'>
          <h1 className='text-3xl mt-6 mb-14'>Ibidun Layi-Ojo</h1>
          <p className='font-bold text-lg tracking-wider'>
            The most important thing you need to <br /> know about me is that I
            am a Jesus girl.
          </p>
        </div>

        <div>
          <img src='/assets/banner-img.png' alt='' />
        </div>
      </section>

      <section className='md:mt-24 md:md-20 my-10 container md:w-[95%] mx-auto relative p-3 md:p-0'>
        <div className='absolute start-[23.3rem] -top-4'>
          <img src='/assets/circle.png' alt='' className='w-[1.1rem]' />
        </div>
        <h1 className='text-center md:text-2xl text-xl mt-6 md:mb-12 mb-5 leading-[4.5rem] tracking-wider'>
          Welcome To Flowing <br className='md:hidden' /> Rivers
        </h1>
        <p className='text-lg'>
          Hi, I’m Ibidun. I love Jesus passionately and He is the center of my
          life. Words are my favorite things - I really enjoy writing and
          reading good books. Once I start a good book, I find it hard to put it
          down till I read the last word. Growing up, I remember hiding in the
          closet or crawling under the blanket in my room to finish a book
          undisturbed.{' '}
        </p>
        <p className='mt-5 text-lg'>
          Today, my favorite hideout in our house is still the library. When I
          am not being a wife or a mom, I am writing; and when I am not writing,
          I am reading. If you have a good book – let’s connect.
        </p>
        <div className=''>
          <img
            src='/assets/circle.png'
            alt=''
            className='w-[1.1rem] absolute md:-start-14 md:bottom-5 -bottom-5'
          />
          <img
            src='/assets/circle.png'
            alt=''
            className='w-[1.1rem] absolute md:-end-14 end-0 bottom-24'
          />
        </div>
      </section>
    </main>
  );
};

export default Banner;
