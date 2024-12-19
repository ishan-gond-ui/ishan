import React, { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';
import PropTypes from 'prop-types';

const Post = ({ post }) => {
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const { user } = useSelector((store) => store.auth);
    const { posts } = useSelector((store) => store.post);
    const dispatch = useDispatch();

    const liked = useMemo(() => post.likes.includes(user?._id), [post.likes, user]);
    const postLikeCount = useMemo(() => post.likes.length, [post.likes]);

    const changeEventHandler = (e) => {
        setText(e.target.value.trim());
    };

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/v1/post/${post._id}/${action}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                const updatedPostData = posts.map((p) =>
                    p._id === post._id
                        ? {
                              ...p,
                              likes: liked
                                  ? p.likes.filter((id) => id !== user._id)
                                  : [...p.likes, user._id],
                          }
                        : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error liking/disliking post:", error.message);
        }
    };

    const commentHandler = async () => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/v1/post/${post._id}/comment`,
                { text },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                const updatedPostData = posts.map((p) =>
                    p._id === post._id ? { ...p, comments: [...p.comments, res.data.comment] } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText('');
            }
        } catch (error) {
            console.error("Error adding comment:", error.message);
        }
    };

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(
                `${process.env.REACT_APP_API_BASE_URL}/api/v1/post/delete/${post._id}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                const updatedPostData = posts.filter((p) => p._id !== post._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error deleting post:", error.message);
        }
    };

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/v1/post/${post._id}/bookmark`,
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error bookmarking post:", error.message);
        }
    };

    return (
        <div className="my-8 w-full max-w-sm mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt="Author Profile" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-3">
                        <h1>{post.author?.username}</h1>
                        {user?._id === post.author._id && <Badge variant="secondary">Author</Badge>}
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        {post.author._id !== user?._id && (
                            <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">
                                Unfollow
                            </Button>
                        )}
                        <Button variant="ghost" className="cursor-pointer w-fit">
                            Add to favorites
                        </Button>
                        {user?._id === post.author._id && (
                            <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit">
                                Delete
                            </Button>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {post.video ? (
                <video
                    className="rounded-sm my-2 w-full aspect-video object-cover"
                    controls
                    preload="metadata"
                    src={post.video}
                    type="video/mp4"
                    onError={(e) => {
                        console.error("Video error:", e.target.src);
                        e.target.parentNode.innerHTML =
                            '<p class="text-center text-gray-500">Video failed to load.</p>';
                    }}
                >
                    Your browser does not support the video tag.
                </video>
            ) : (
                <p className="text-center text-gray-500">No video available</p>
            )}

            <div className="flex items-center justify-between my-2">
                <div className="flex items-center gap-3">
                    {liked ? (
                        <FaHeart
                            onClick={likeOrDislikeHandler}
                            size={24}
                            className="cursor-pointer text-red-600"
                        />
                    ) : (
                        <FaRegHeart
                            onClick={likeOrDislikeHandler}
                            size={22}
                            className="cursor-pointer hover:text-gray-600"
                        />
                    )}

                    <MessageCircle
                        onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }}
                        className="cursor-pointer hover:text-gray-600"
                    />
                    <Send className="cursor-pointer hover:text-gray-600" />
                </div>
                <Bookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-600" />
            </div>

            <span className="font-medium block mb-2">{postLikeCount} likes</span>
            <p>
                <span className="font-medium mr-2">{post.author?.username}</span>
                {post.caption}
            </p>
            {post.comments.length > 0 && (
                <span
                    onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }}
                    className="cursor-pointer text-sm text-gray-400"
                >
                    View all {post.comments.length} comments
                </span>
            )}
            <CommentDialog open={open} setOpen={setOpen} />
            <div className="flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={text}
                    onChange={changeEventHandler}
                    className="outline-none text-sm w-full"
                />
                {text && (
                    <span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer">
                        Post
                    </span>
                )}
            </div>
        </div>
    );
};

Post.propTypes = {
    post: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        video: PropTypes.string,
        caption: PropTypes.string,
        likes: PropTypes.arrayOf(PropTypes.string).isRequired,
        comments: PropTypes.arrayOf(
            PropTypes.shape({
                text: PropTypes.string.isRequired,
                author: PropTypes.string.isRequired,
            })
        ).isRequired,
        author: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            profilePicture: PropTypes.string,
        }).isRequired,
    }).isRequired,
};

export default Post;
