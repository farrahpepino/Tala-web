import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaComment } from 'react-icons/fa';
import { Post } from './PostType';
import axios from 'axios';
import Loading from '../../utils/loading';
import DefaultUserIcon from '../../assets/tala/user.png';
import { User } from '../../utils/User/UserType';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { deletePost } from '../../utils/Services/PostService';
import { getUserData } from '../../utils/User/GetUserData';
import CommentSection from './CommentSection';
import { TrashIcon } from '@heroicons/react/24/solid';
import { Comment } from './PostType';
import { formatDate } from '../../utils/Services/DateFormatter';
import { likePost } from '../../utils/Services/PostService';
import { unlikePost } from '../../utils/Services/PostService';
import { formatNumber } from '../../utils/Services/PostService';
import { transformLikesToString } from './PostType';

interface PostsProps {
  userId?: string; 
  postedBy?: string;
  onAddComment?: (postId: string, commentText: string) => void;

}


let HomePosts: React.FC<PostsProps> = ({ userId }) => {
  const navigate = useNavigate();

  let [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const currentLoggedIn = getUserData();
  
    let fetchUserData = async () => {
      try {
        const response = await axios.get(`https://tala-web-kohl.vercel.app/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    let fetchHomePosts = async () => {
      try {
        let response = await axios.get(`https://tala-web-kohl.vercel.app/api/post/${userId}/all-posts`);
        setPosts(response.data);
        console.log('Fetched home posts:', response.data);
      } catch (error) {
        console.error('Error fetching home posts:', error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchHomePosts(); 

      setLoading(false);
    }
  }, [userId]);

  
  
  const UserDetails = async (userId: string) => {
    try {
      const response = await axios.get(`https://tala-web-kohl.vercel.app/api/users/${userId}`);
      return response.data;  
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;  // Return null in case of error
    }
  };
  const handleAddComment = async (postId: string, commentText: string) => {
    console.log(postId, 'hi')
    try {
      const response = await axios.post<{ message: string; comment: Comment }>(
        `https://tala-web-kohl.vercel.app/api/post/${currentLoggedIn._id || currentLoggedIn.userId}/${postId}/new-comment`,
        { content: commentText }
      );
  
      console.log(response, response.data)
      const newComment: Comment = response.data.comment;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...post.comments, newComment], 
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
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
          
          <button
  className="bg-transparent w-full"
  onClick={(event) => {
    event.preventDefault();
    if (typeof post.postedBy === 'object' && post.postedBy._id) {
      navigate(`/${post._id}`);
    } else {
      console.error('Invalid postedBy format:', post.postedBy);
    }
  }}
>
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
              {(typeof post.postedBy !== 'string' && post.postedBy._id === userId) && (                  <div className="text-right -mt-11">
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
                            deletePost((currentLoggedIn._id || currentLoggedIn.userId), post._id); 
                            fetchHomePosts();
                          }} >
                          <div className='flex flex-row items-center'>
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

            </div>
            <p className="mt-4 text-gray-300 text-left ml-14">{post.description}</p>
            </button>
            <div className="flex space-x-4 mt-4">
            <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
              <button
            className={`flex items-center space-x-1 bg-transparent ${Array.isArray(post.likes) && post.likes.some(like => like.likedBy._id === (currentLoggedIn._id || currentLoggedIn.userId)) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
            onClick={async () => {
              let updatedLikes: number | { likedBy: string }[] = transformLikesToString(post.likes);
              const userHasLiked = Array.isArray(post.likes) && post.likes.some(like => like.likedBy._id === (currentLoggedIn._id || currentLoggedIn.userId));
          
              if (Array.isArray(updatedLikes)) {
                if (userHasLiked) {
                  updatedLikes = updatedLikes.filter(like => like.likedBy !== (currentLoggedIn._id || currentLoggedIn.userId)); 
                } else {
                  updatedLikes.push({ likedBy: (currentLoggedIn._id || currentLoggedIn.userId) }); 
                }
              } else {
                updatedLikes = userHasLiked ? Math.max(updatedLikes - 1, 0) : updatedLikes + 1;
              }
          
              setPosts((prevPosts) =>
                prevPosts.map((p) =>
                  p._id === post._id
                    ? {
                        ...p,
                        likes: updatedLikes,
                      }
                    : p
                )
              );
          
              try {
                if (userHasLiked) {
                  await unlikePost((currentLoggedIn._id || currentLoggedIn.userId), post._id); 
                } else {
                  await likePost((currentLoggedIn._id || currentLoggedIn.userId), post._id); 
                }
              } catch (error) {
                console.error('Error toggling like:', error);
                setPosts((prevPosts) =>
                  prevPosts.map((p) =>
                    p._id === post._id
                      ? {
                          ...p,
                          likes: post.likes, 
                        }
                      : p
                  )
                );
              }
            }}
          >
                <FaHeart size={16} />
                <span               data-dropdown-trigger="hover"       
                

>  {Array.isArray(post.likes) ? formatNumber(post.likes.length) : formatNumber(post.likes)}

</span>
              </button>
              {isOpen && (
Array.isArray(post.likes) && post.likes.length > 0 ? (

    <ul
      role="menu"
      data-popover="notifications-menu"
      data-popover-placement="bottom"
      className="absolute max-h-[200px] min-w-[400px] z-10  overflow-auto rounded-lg border border-slate-200 bg-white p-1.5  focus:outline-none"
    >

          {post.likes.map((like, index) => (
            
      <li
        role="menuitem"
        key={index}
        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
      >
        <img
          alt= 'User avatar'
          src={DefaultUserIcon}
          className="relative inline-block h-10 w-10 rounded-full object-cover object-center"
        />
        <div className="flex flex-col gap-1 ml-4">
          <p className="text-slate-800 font-medium">
          {like.likedBy.firstName} {like.likedBy.lastName}
          </p>
          {/* <p className="text-slate-500 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 text-slate-400">
              <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clip-rule="evenodd" />
            </svg>
     
            13 minutes ago
          </p> */}
        </div>
        
      </li>))}


        
    
    </ul> ) :     <span>No likes yet</span>

       )}
               </div>

              <button className="flex items-center space-x-1 text-gray-400 bg-transparent">
                <FaComment size={16} />
                <span>{post.comments.length}</span>
              </button>
            </div>
            {/* Comment Section */}
            <CommentSection postId={post._id} userId={currentLoggedIn._id || currentLoggedIn.userId} isSinglePost={false} postUserId={typeof post.postedBy === "string" ? post.postedBy : post.postedBy._id} />
          </div>
        ))
      )}
    </div>
  );
};

export default HomePosts;
