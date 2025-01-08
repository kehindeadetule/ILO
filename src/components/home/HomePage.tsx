import Banner from './Banner';
import Blog from './Blog';
import Podcast from './LastestPodcast';

const HomePage = () => {
  return (
    <section className='overflow-x-hidden'>
      <Banner />
      <Blog />
      <Podcast />
    </section>
  );
};
export default HomePage;
