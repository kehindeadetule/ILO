import React from 'react';

const CircleLoader = () => {
  return (
    <div className='col-span-full flex justify-center items-center min-h-[200px]'>
      <div className='w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin'></div>
    </div>
  );
};

export default CircleLoader;
