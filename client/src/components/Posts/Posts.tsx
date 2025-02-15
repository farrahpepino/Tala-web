import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment } from 'react-icons/fa';
import { Post } from './PostType';
import axios from 'axios';
import Loading from '../../utils/loading';
import DefaultUserIcon from '../../assets/tala/user.png';
import { User } from '../../utils/User/UserType';
interface PostsProps {
  userId?: string; 
  postedBy?: string;

}
const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(1).slice(0, 3) + 'Z'; // Zillion
  }
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).slice(0, 3) + 'B'; // Billion
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).slice(0, 3) + 'M'; // Million
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).slice(0, 3) + 'k'; // Thousand
  }
  return num.toString().slice(0, 3); 
};

let Posts: React.FC<PostsProps> = ({ userId }) => {
  console.log('Received userId for post:', userId);
  let [user, setUser] = useState<User | null>(null);
  let [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let fetchUserData = async () => {
      try {
        const response = await 
        axios.get(`http://localhost:5005/api/users/${userId}`);
        // axios.get(`https://tala-web-kohl.vercel.app/api/users/${userId}`);
        console.log('done');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    let fetchUserPosts = async () => {
      try {
        let response = await axios.get(`http://localhost:5005/api/post/${userId}/posts`);
        // axios.get(`https://tala-web-kohl.vercel.app/api/post/${userId}/posts`);
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
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
