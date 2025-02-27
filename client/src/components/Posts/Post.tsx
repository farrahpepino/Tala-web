import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Post as PostType } from './PostType';
import React from 'react';
import { transformLikesToString } from './PostType';
import { formatNumber } from '../../utils/Services/PostService';
import { FaHeart, FaComment } from 'react-icons/fa';
import Loading from '../../utils/loading';
import DefaultUserIcon from '../../assets/tala/user.png';
import { User } from '../../utils/User/UserType';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { deletePost } from '../../utils/Services/PostService';
import { getUserData } from '../../utils/User/GetUserData';
import { TrashIcon } from '@heroicons/react/24/solid';
import { formatDate } from '../../utils/Services/DateFormatter';
import { likePost } from '../../utils/Services/PostService';
import { unlikePost } from '../../utils/Services/PostService';
import NavBar from '../NavBar';

import CommentSection from './CommentSection';
const Post = () => {
  const { userId, postId } = useParams<{ userId: string; postId: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const [currentLoggedIn, setCurrentLoggedIn] = useState<User | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://tala-web-kohl.vercel.app/api/post/${userId}/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchUserData = async () => {
      const userData = await getUserData();
      setCurrentLoggedIn(userData);
    };

    fetchPost();
    fetchUserData();
  }, [userId, postId]);

  if (!post || !currentLoggedIn) {
    return <Loading />;
  }

  const isPostOwner = typeof post.postedBy !== 'string' && post.postedBy._id === currentLoggedIn.userId;

  return (
<div className="mx-auto">
      <div className="w-full xss:w-[280px] md:w-[480px] lg:w-[660px] xl:w-[900px] p-6 md:p-10 shadow-lg rounded-lg">    <NavBar />
    <main className="flex justify-center w-full px-4  pb-80">
      <div className="mt-4 mx-auto w-full max-w-4xl">
      <div className="w-full">

    <div className="space-y-8">
      <div className="flex flex-col">
        <div className="text-left">
          <div className="flex space-x-3 mb-1">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={DefaultUserIcon}
              alt={`${post.userName}'s avatar`}
            />
            <div className="text-left">
              <p className="font-semibold text-white">
                {typeof post.postedBy !== 'string'
                  ? `${post.postedBy.firstName} ${post.postedBy.lastName}`
                  : 'Unknown User'}
              </p>
              <p className="text-sm text-gray-400">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          {isPostOwner && (
            <div className="text-right -mt-11">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-transparent px-2 py-2 text-sm font-semibold text-gray-100 shadow-xs hover:bg-gray-50">
                    <ChevronDownIcon aria-hidden="true" className="size-5 text-gray-400" />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-1">
                    <MenuItem>
                      <a
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        onClick={(e) => {
                          e.preventDefault();
                          deletePost(currentLoggedIn.userId, post._id);
                        }}
                      >
                        <div className="flex flex-row items-center">
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Delete post
                        </div>
                      </a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            </div>
          )}
        </div>

        <p className="mt-4 text-gray-300 text-left ml-14">{post.description}</p>
        <div>
        {post.postImages?.length > 0 && (
  <div className="grid grid-cols-2 gap-2">
    {post.postImages.map((image, index) => (
      <div key={index}>
        <img
          className="h-auto max-w-full rounded-lg"
          src={image}
          alt={`Post image ${index + 1}`}
        />
      </div>
    ))}
    
    </div>
)}

        </div>
        <div className="flex space-x-4 mt-4">
          <button
            className={`flex items-center space-x-1 bg-transparent ${
              Array.isArray(post.likes) && post.likes.some(like => like.likedBy.toString() === currentLoggedIn.userId)
                ? 'text-red-500'
                : 'text-gray-400'
            } hover:text-red-500`}
            onClick={async () => {
              let updatedLikes: number | { likedBy: string }[] = transformLikesToString(post.likes);
              const userHasLiked = Array.isArray(post.likes) && post.likes.some(like => like.likedBy.toString() === currentLoggedIn.userId);

              if (Array.isArray(updatedLikes)) {
                if (userHasLiked) {
                  updatedLikes = updatedLikes.filter(like => like.likedBy !== currentLoggedIn.userId);
                } else {
                  updatedLikes.push({ likedBy: currentLoggedIn.userId });
                }
              } else {
                updatedLikes = userHasLiked ? Math.max(updatedLikes - 1, 0) : updatedLikes + 1;
              }

              try {
                if (userHasLiked) {
                  await unlikePost(currentLoggedIn.userId, post._id);
                } else {
                  await likePost(currentLoggedIn.userId, post._id);
                }
              } catch (error) {
                console.error('Error toggling like:', error);
              }
            }}
          >
            <FaHeart size={16} />
            <span>{Array.isArray(post.likes) ? formatNumber(post.likes.length) : formatNumber(post.likes)}</span>
          </button>
          
        </div>
        
      </div>
      
    </div>            
    <div className='w-full '><CommentSection postId={post._id} userId={currentLoggedIn.userId} isSinglePost={true} postUserId={typeof post.postedBy === "string" ? post.postedBy : post.postedBy._id}/>
    </div>
    
    </div>
    
    </div>

    </main>
    
    </div>            
        </div>

  );
};

export default Post;
