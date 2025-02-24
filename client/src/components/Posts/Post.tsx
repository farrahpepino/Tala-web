import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Post } from './PostType';
import React from 'react';

const Post: React.FC = () => {
  const { userId, postId } = useParams<{ userId: string; postId: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://tala-web-kohl.vercel.app/api/post/${userId}/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [userId, postId]);

  if (!post) {return <p>Loading...</p>};

  return (
    <div>
      <h1>{post.description}</h1>
      {/* <p>Posted by: {post.postedBy?._id.firstName} {post.postedBy?.lastName}</p> */}
    </div>
  );
};

export default Post;
