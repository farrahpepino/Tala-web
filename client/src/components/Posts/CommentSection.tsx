import React, { useState } from 'react';
import { User } from '../../utils/User/UserType';

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
    <div className="mt-4">
      {/* Comment Input */}
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-2 border rounded-md text-sm"
      />
      <button
        onClick={handleAddComment}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Post Comment
      </button>

      {/* Render Comments */}
      <div className="mt-4">
        {comments.length === 0 ? (
          <p className="text-gray-400">No comments yet.</p>
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
