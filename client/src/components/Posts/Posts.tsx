import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment } from 'react-icons/fa';
import { Post } from './PostType';
// import api from '../../utils/api';
import axios from 'axios';
import Loading from '../../utils/loading';
import { User } from '../../utils/User/UserType';
interface PostsProps {
  userId?: string; 
  postedBy?: string;

}

let Posts: React.FC<PostsProps> = ({ userId }) => {
  console.log('Received userId for post:', userId)
  let [user, setUser] = useState<User | null>(null); 
  let [posts, setPosts] = useState<Post[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    
    let fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5003/api/users/${userId}`);
        setUser(response.data); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    let fetchUserPosts = async () => {
      try {
        let response = await axios.get(`http://localhost:5003/api/post/user/${userId}/posts` ,{
          withCredentials: true}); 
        setPosts(response.data); 
        console.log('Fetched user posts:', response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
      fetchUserPosts();
      setLoading(false);
    }
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
            <div className="flex space-x-3 mb-1">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src="https://i.pinimg.com/564x/6b/1e/58/6b1e58e2f70b14528111ee7c1dd0f855.jpg"
                alt={`${post.userName}'s avatar`}
              />
              <div className="text-left">
              <p className="font-semibold">
              {typeof post.postedBy !== 'string'
                ? `${post.postedBy.firstName} ${post.postedBy.lastName}`
                : 'Unknown User'}
            </p>
            <p className="text-sm text-gray-400">
            {formatDate(post.createdAt)}
            </p>
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
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-400 bg-transparent">
                <FaComment size={16} />
                <span>{post.comments.length}</span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
