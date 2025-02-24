import React, { useEffect, useState } from 'react';
import { User } from '../../utils/User/UserType';
import { TrashIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import DefaultUserIcon from '../../assets/tala/user.png';
import { FaHeart, FaEllipsisH } from 'react-icons/fa';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Comment } from './PostType';
import { getUserData } from '../../../../server/controllers/UserController';
import axios from 'axios';
interface CommentSectionProps {
  postId: string;
  // comments: Comment[];
  userId: string;
  // onAddComment: (commentText: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, userId }) => {
  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      return; 
    }

    try {
      const response = await axios.post(`https://tala-web-kohl.vercel.app/api/post/${userId}/${postId}/new-comment`, {
        content: newComment
      });

      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment(''); 
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://tala-web-kohl.vercel.app/api/post/${postId}/comments`);
      console.log(comments);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };  
  useEffect(()=>{
    fetchComments();
  }, [postId]);

  
  

  return (
    <div>
      {/* Comment Input */}
      <div className='flex flex-row items-center'>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        className="flex-grow bg-white bg-opacity-10 rounded-full  w-full h-10 text-gray-200 placeholder-gray-400 px-4 focus:outline-none"
        />
      <button
        onClick={handleAddComment}
        className="w-10 h-10 ml-1 rounded-full flex items-center justify-center text-white bg-gray-800 hover:bg-gray-600 transition-all duration-200">          
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
      </div>
     {/* Render Comments */}
<div className="mt-2">
  {comments.length === 0 ? (
    <div className="flex gap-1">
    <div className="relative ml-5 ">
      <div className="absolute top-0 left-0 h-6 w-0.5 bg-gray-600"></div> 
      <div className="absolute top-6 left-0 w-5 h-0.5 bg-gray-600"></div> 
    </div>
    <p className="text-gray-400 text-sm ml-7 mt-3">No comments yet.</p>
  </div>
  ) : (
    comments.map((comment, idx) => (
      <div key={idx} className="px-1 pb-2 bg-transparent rounded-md">
        {/* Comment Container */}
        <div className="flex gap-1">
          <div className="relative ml-4">
          <div className="absolute top-0 left-0 h-6 w-0.5 bg-gray-600"></div> 
      <div className="absolute top-6 left-0 w-5 h-0.5 bg-gray-600"></div> 
          </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3 ">
            <img
              className="h-10 w-10 rounded-full object-cover ml-7 mt-2"
              src={DefaultUserIcon}
            />
            <div>
              <div className="flex items-center gap-4">
              <p className="font-bold text-white">
                          {typeof comment.commentBy === 'string' ? comment.commentBy : `${comment.commentBy.firstName} ${comment.commentBy.lastName}`}
                        </p>                <p className="text-gray-300">{comment.text}</p>
              </div>
              <p className="text-gray-400 text-xs">{comment.createdAt}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="text-gray-400 bg-transparent p-0 m-0 hover:text-red-500">
            <FaHeart size={16} />
            </button>
            {/* {(typeof comment.commentedBy !== 'string' && post.postedBy._id === userId) && (                  <div className="text-right -mt-11"> */}
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-transparent px-2 py-2 text-sm font-semibold text-gray-100 shadow-xs hover:bg-gray-50">
                          <FaEllipsisH aria-hidden="true" className="size-4 text-gray-400" />
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
                         
                          }} >
                            <div className='flex flex-row items-center'>
                              <TrashIcon className="w-4 h-4 mr-2" />
                              Delete comment
                              </div>
                            </a>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </Menu>
                  </div>
          </div>
          </div>

        </div>
        
    ))
  )}
</div>


</div>

);
                        }

export default CommentSection;