import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { FaImage } from 'react-icons/fa'; 
import { User } from '../../utils/User/UserType';
import { getUserData } from '../../utils/User/GetUserData';
import { handleReload } from '../../utils/HandleReload';
import axios from 'axios';
const AddPost = () => {
  const [user, setUser] = useState<User | null>(null);
  const [description, setDescription] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const token = localStorage.getItem('token');

  //better code for this
  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const userData = getUserData();
    console.log('Fetched user data:', userData); 
    if (!userData) {
      handleReload();
    } else {
      setUser(userData);
    }
  }, []);

  const handlePostSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!description) {
      alert('Please add a description.');
      return;
    }
  
    try {
      const formData = new FormData();
           
      formData.append('description', description);
      formData.append('postedBy', user?.userId || '');
      console.log('Posted by:', user?.userId || '');
      const response = await axios({
        method: 'POST',
        url: 'http://localhost:5005/api/post/createPost',
        // url: 'https://tala-web-kohl.vercel.app/api/post/createPost',
        data: {
            description,
            postedBy: user?.userId || '',
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
      console.log('Response:', formData);
      
    
  
      if (response.status === 201) {
        setDescription(''); 
        handleReload();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
    handleReload();

  };
  

  return (

    <div className="mx-auto">
      <div className="w-full sm:w-[280px] md:w-[480px] lg:w-[660px] xl:w-[900px] p-6 md:p-10 shadow-lg rounded-lg">
      <form onSubmit={handlePostSubmit} className="flex flex-col space-y-2">
        
        <div className="relative w-100 mt-2">
          <textarea
            ref={textareaRef}
            className="p-3 w-100 mt-1 bg-white bg-opacity-10 pr-20 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 resize-none overflow-hidden text-white placeholder-gray-400"
            rows={3}
            placeholder={`What's on your mind, ${user?.firstName}?`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onInput={autoResize}
          />
          <div className="absolute bottom-4 right-2 flex space-x-2">
            {/* Image Upload Button (Disabled) */}
            <label className="p-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer">
              <FaImage size={18} />
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => console.log('Image upload disabled')} // Disabled for now
              />
            </label>

            <button
              type="submit"
              className={`px-4 py-1 rounded-full text-white hover:bg-gray-800 ${
                description ? 'bg-gray-700' : 'bg-gray-500 cursor-not-allowed'
              }`}
              disabled={!description}
            >
              Post
            </button>
            </div>
        
        </div>
      </form>
   </div>
    </div>
  );
};

export default AddPost;
