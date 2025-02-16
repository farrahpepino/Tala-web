import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment } from 'react-icons/fa';
import { Post } from './PostType';
import axios from 'axios';
import Loading from '../../utils/loading';
import DefaultUserIcon from '../../assets/tala/user.png';
import { User } from '../../utils/User/UserType';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { getUserData } from '../../utils/User/GetUserData';
import { deletePost } from '../../utils/Services/PostService';
import CommentSection from './CommentSection';
interface PostsProps {
  userId?: string; 
  postedBy?: string;

}
const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(1).slice(0, 3) + 'Z'; 
  }
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).slice(0, 3) + 'B'; 
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).slice(0, 3) + 'M'; 
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).slice(0, 3) + 'k';
  }
  return num.toString().slice(0, 3); 
};

let Posts: React.FC<PostsProps> = ({ userId }) => {
  let [user, setUser] = useState<User | null>(null);
  let [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const currentLoggeedIn = getUserData();
  const fetchUserData = async () => {
    if (userId) {
      try {
        const response = await axios.get(`http://localhost:5005/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  const fetchUserPosts = async () => {
    if (userId) {
      try {
        let response = await axios.get(`http://localhost:5005/api/post/${userId}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [userId]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
    return formatter.format(date);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8">
      {posts.length === 0 ? (
        <p className="text-gray-400 text-center">No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="p-4 rounded-md text-white">
            <div className="flex flex-col">
              <div className='text-left'>
            <div className="flex space-x-3 mb-1">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={DefaultUserIcon}
                alt={`${post.userName}'s avatar`}
              />
              <div className="text-left">
                <p className="font-semibold">
                  {typeof post.postedBy !== 'string'
                    ? `${post.postedBy.firstName} ${post.postedBy.lastName}`
                    : 'Unknown User'}
                </p>
                <p className="text-sm text-gray-400">{formatDate(post.createdAt)}</p>
                
              </div>
              </div>

              <div className={( typeof post.postedBy!== 'string' && post.postedBy._id === currentLoggeedIn.userId )? 'text-right -mt-11' : ''}>
              {(typeof post.postedBy !== 'string' && post.postedBy._id === currentLoggeedIn.userId) && (                  <div className="text-right -mt-11">

              <Menu as="div" className="relative inline-block text-left ">
                  <div>
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-transparent px-2 py-2 text-sm font-semibold text-gray-100  shadow-xs  hover:bg-gray-50">
                      <ChevronDownIcon aria-hidden="true" className=" size-5 text-gray-400" />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <div className="py-1">
                      <MenuItem >
                        <a
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          onClick={(e) => {
                            e.preventDefault(); 
                            deletePost(currentLoggeedIn.userId, post.id); 
                            fetchUserPosts();

                          }} >
                          Delete post
                        </a>
                      </MenuItem>
                    
                    </div>
                  </MenuItems>
                </Menu>
                </div>
              )}
              </div>
            </div>
            </div>
            <p className="mt-4 text-gray-300 text-left ml-14">{post.description}</p>
            <div className="flex space-x-4 mt-4">
              <button
                className="flex items-center space-x-1 bg-transparent text-gray-400 hover:text-red-500"
                onClick={() =>
                  setPosts((prev) =>
                    prev.map((p) =>
                      p.id === post.id ? { ...p, likes: p.likes + 1 } : p
                    )
                  )
                }
              >
                <FaHeart size={16} />
                <span>{formatNumber(post.likes)}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-400 bg-transparent">
                <FaComment size={16} />
                <span>{post.comments.length}</span>
              </button>
            </div>
            {/* Comment Section */}
            <CommentSection
                postId={post.id}
                comments={post.comments} 
                onAddComment={(commentText) => {
                  const newComment = {
                    text: commentText,
                    createdAt: new Date().toISOString(),
                    postedBy: currentLoggeedIn, 
                  };
                  setPosts((prevPosts) =>
                    prevPosts.map((p) =>
                      p.id === post.id ? { ...p, comments: [...p.comments, newComment] } : p
                    )
                  );
                }}
              />
          </div>
          ))
      )}
    </div>
  );
};

export default Posts;
