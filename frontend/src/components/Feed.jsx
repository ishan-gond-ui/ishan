import React from 'react';
import Posts from './Posts'; // Ensure correct import path

const Feed = () => {
  console.log("Feed component is rendering");
  return (
    <div className="flex justify-center items-start my-8 px-4 w-full">
      <div className="flex flex-col items-center w-full max-w-2xl">
        <Posts /> {/* Correctly uses the Posts component */}
      </div>
    </div>
  );
};

export default Feed;
