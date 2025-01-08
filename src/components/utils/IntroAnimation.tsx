import { useRef } from 'react';

interface AnimationLoaderProps {
  onComplete: () => void;
}

const AnimationLoader = ({ onComplete }: AnimationLoaderProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className='fixed inset-0 bg-black flex items-center justify-center z-50'>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={onComplete}
        className='w-full h-full object-contain'>
        <source src='/assets/intro-v.mp4' type='video/mp4' />
      </video>
    </div>
  );
};

export default AnimationLoader;
