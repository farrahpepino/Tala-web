import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../utils/User/UserType';
import { getUserData } from '../../utils/User/GetUserData';
import { useParams } from 'react-router-dom';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DefaultUserIcon from '../../assets/tala/user.png';
import NavBar from '../NavBar';
import Posts from '../Posts/Posts';
import axios from 'axios';
const ExternalProfile = () => {
  const [error, setError] = useState<string | null>(null);
  const { userId } = useParams(); 
  const [user, setUser] = useState<User | null>(null);
  const [friendStatus, setFriendStatus] = useState<'not_friends' | 'request_sent' | 'friends'>('not_friends');

  const navigate = useNavigate();
  console.log('User ID for external profile:', userId);
  const senderId = getUserData()?.userId || getUserData()?._id;
  const receiverId = userId;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://tala-web-kohl.vercel.app/api/users/${userId}`);
        console.log('Response:', response);
        setUser(response.data);
        console.log('Fetched user:', response.data);

        const friendResponse = await axios.get(`https://tala-web-kohl.vercel.app/api/friend-status/${userId}`);
        setFriendStatus(friendResponse.data.status);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.response ? err.response.data : 'Internal Server Error');
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  //request_sent,request_received, request_accepted, request_declined
  const handleAddFriend = async () => {
    try {
      const response = await axios.post(`https://tala-web-kohl.vercel.app/api/friends/sendRequest/${senderId}/${receiverId}`);
      console.log('Friend request sent:', response.data);
      setFriendStatus('request_sent');
    } catch (err: any) {
      console.error('Add Friend Error:', err);
      setError(err.response ? err.response.data : 'Unable to send friend request');
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="flex justify-center w-full px-4">
        <div className="w-full sm:w-[280px] md:w-[480px] lg:w-[660px] xl:w-[900px] p-6 md:p-10 shadow-lg rounded-lg">
          <div className="flex flex-col items-center -mt-16">
            <img
              src= {DefaultUserIcon}
              alt="user-avatar"
              className="w-32 h-32 mt-20 border-4 border-white rounded-full"
            />
            <h3 className="text-2xl font-bold text-gray-300 mt-4">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-gray-400 text-center">{user?.bio}</p>
            
            <div className="flex gap-2 mt-3" style={{ maxWidth: '290px', width: '100%' }}>
              {friendStatus === 'not_friends' && (
                <button 
                  className="btn btn-dark flex-grow px-6 py-2 rounded-pill" 
                  onClick={handleAddFriend}
                >     
                  <FontAwesomeIcon icon={faUserPlus} /> Add Friend
                </button>
              )}
              {friendStatus === 'request_sent' && (
                <button className="btn btn-warning flex-grow px-6 py-2 rounded-pill" disabled>
                  Request Sent
                </button>
              )}
              {friendStatus === 'friends' && (
                <button className="btn btn-success flex-grow px-6 py-2 rounded-pill" disabled>
                  Friends
                </button>
              )}
              <button className="btn btn-light text-dark flex-grow px-6 py-2 rounded-pill">
                Message
              </button>
            </div>
          </div>
        </div>
      </main>

        <div className="mt-8 w-full max-w-4xl">
        <Posts userId={userId}/>
        </div>


    </div>
  );
};

export default ExternalProfile;
