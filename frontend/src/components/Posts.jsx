import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Posts = ({ post }) => {
  if (!post) {
    return <p>No post available.</p>;
  }

  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);

  console.log("Video URL:", post.video);
  console.log("Posts component is rendering");

  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      {post.video && post.video.trim() ? (
        <video
          className="rounded-sm my-2 w-full aspect-video object-cover"
          controls
          preload="metadata"
          src={post.video}
          type="video/mp4"
          onError={(e) => {
            console.error("Video failed to load:", e.target.src);
            e.target.parentNode.innerHTML =
              '<p class="text-center text-gray-500">Video failed to load.</p>';
          }}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <p className="text-center text-gray-500">No video available</p>
      )}
      {/* Other content */}
    </div>
  );
};

export default Posts;
