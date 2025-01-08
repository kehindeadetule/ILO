import Link from 'next/link';
import { FaFacebook } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { FaYoutube } from 'react-icons/fa6';
import { FaSquareInstagram } from 'react-icons/fa6';

const Footer = () => {
  return (
    <main className=' bg-[#020203] text-white md:min-h-[50vh] min-h-[65vh] '>
      <section className='container md:w-1/2 mx-auto text-center'>
        <div>
          <h2 className='font-semibold text-xl pt-8 mb-4'>SUBSCRIBE</h2>
          <p className='textlg'>
            Subscribe to get new blog posts, tips & new photos delivered to your
            inbox. <br className='hidden md:block' /> Let&apos;s stay connected!
          </p>
          <div className='md:space-x-4 mt-12 md:p-0 p-4'>
            <input
              type='text'
              placeholder='Enter your email address'
              className='md:placeholder:text-xs bg-inherit border border-white px-2 md:pt-1 md:pb-1.5 py-2 md:w-1/3 w-full'
            />
            <br className='block md:hidden' />
            <button className='bg-white text-black md:text-xs font-semibold md:px-8 py-2.5 md:w-auto w-full mt-5 md:mt-0'>
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <div className='mt-16 flex justify-between '>
        <img
          src='/assets/footer-line2.png'
          alt='footer line'
          className='md:w-1/4 w-1/3 '
        />
        <div className=''>
          <div className='flex flex-row space-x-4 text-white text-center items-center justify-center mt-5'>
            <Link href='https://www.facebook.com/ibidunl' className=''>
              <span className='text-2xl'>
                <FaFacebook />
              </span>
            </Link>
            <Link
              href='https://x.com/Ibidun?t=9cMOJv0sCd9MjEdZkfn5cA&s=08'
              className=''>
              <span className='text-2xl'>
                <FaSquareXTwitter />
              </span>
            </Link>
            <Link href='https://youtube.com/@letitflowpodcastwithibidun?si=_lTYI_rALGOBrt3J'>
              <span className='text-3xl'>
                <FaYoutube />
              </span>
            </Link>
            <Link href='https://www.instagram.com/ibidun_layiojo?igsh=MTQ4a2QwNmg2Z2N3bw=='>
              <span className='text-2xl'>
                <FaSquareInstagram />
              </span>
            </Link>
          </div>
          <p className='text-xs mt-4 hidden md:block'>
            &copy; <span>{new Date().getFullYear()}</span> Ibidunlayiojo.com.
            All Right Reserved.
          </p>
        </div>
        <img
          src='/assets/footer-line1.png'
          alt='footer line'
          className='md:w-1/4 w-1/3 '
        />
      </div>
      <p className='text-xs mt-4 text-center block md:hidden'>
        &copy; <span>{new Date().getFullYear()}</span> Ibidunlayiojo.com. All
        Right Reserved.
      </p>
    </main>
  );
};

export default Footer;
