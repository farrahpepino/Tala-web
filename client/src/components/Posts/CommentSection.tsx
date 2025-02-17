import React, { useState } from 'react';
import { User } from '../../utils/User/UserType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

interface Comment {
  text: string;
  createdAt: string;
  postedBy: string | User;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (commentText: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

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
          <p className="text-gray-400 text-s">No comments yet.</p>
        ) : (
          comments.map((comment, idx) => (
            <div key={idx} className="mt-2 p-2 bg-gray-100 rounded-md">
              <p className="text-gray-600">{comment.text}</p> {/* Access comment.text instead of just 'comment' */}
              <p className="text-gray-400 text-sm">{comment.createdAt}</p> {/* Optionally show the creation date */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
