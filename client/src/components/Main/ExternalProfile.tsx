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
import Footer from '../Footer';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
const ExternalProfile = () => {
  const [error, setError] = useState<string | null>(null);
  const { userId } = useParams(); 
  const [user, setUser] = useState<User | null>(null);
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'friends'>('none');
  const [friendRequestSender, setFriendRequestSender] = useState<string | null>(null);

  const navigate = useNavigate();
  console.log('User ID for external profile:', userId);
  const senderId = (getUserData()?.userId || getUserData()?._id)?.toString();
  const receiverId = userId;

  const fetchFriendStatus = async () => {
     
    try {
    const response = await axios.get(`https://tala-web-kohl/api/friends/status`, {
      params: { currentUserId: senderId, otherUserId: receiverId },
    });
    const status = response.data.status;
    console.log(response.data.status)
    if (status === 'pending' && response.data.senderId) {
      setFriendRequestSender(response.data.senderId);
    } else {
      setFriendRequestSender(null);
    }
    console.log("status", status)
    setFriendStatus(status); // "friends", "pending", or "none"
  } catch (error) {
    console.error("Error fetching friend status:", error);
  }
};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://tala-web-kohl/api/users/${userId}`);
        console.log('Fetched user:', response.data);
        setUser(response.data);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.response ? err.response.data : 'Internal Server Error');
      }
    };
    
    
    if (userId) {
      fetchUser();
      fetchFriendStatus();
    }
  }, [userId, senderId]);
  fetchFriendStatus();

  const handleAddFriend = async () => {
    try {
      const response = await axios.post(`https://tala-web-kohl/api/friends/send`, {
         senderId,
         receiverId
      });
      console.log('Friend request sent:', response.data);
      fetchFriendStatus();
    } catch (err: any) {
      console.error('Add Friend Error:', err);
      setError(err.response?.data || 'Unable to send friend request');
    }
  };

  const accept = async() => {

    try{
      const response = await axios.post(`https://tala-web-kohl/api/friends/accept`, {
        senderId: userId,
        receiverId: senderId,
     });
     console.log('Friend request accepted:', response.data);
     fetchFriendStatus();
        }
    catch (err: any) {
      console.error('Accept Friend Request Error:', err);
      setError(err.response?.data || 'Unable to accept friend request');
    }


  }

  const decline = async() => {

    try{
      const response = await axios.post(`https://tala-web-kohl/api/friends/decline`, {
        senderId: userId,
        receiverId: senderId,
     });
     console.log('Friend request declined:', response.data, friendRequestSender, userId);
     fetchFriendStatus();     
    }
    catch (err: any) {
      console.error('Decline Friend Request Error:', err);
      setError(err.response?.data || 'Unable to decline friend request');
    }


  }


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
            {friendStatus === 'pending' && friendRequestSender && friendRequestSender !== senderId  &&(
                <div className="flex gap-2">
                  <button className="btn btn-success flex-grow px-6 py-2 rounded-pill" onClick={accept}>Accept</button>
                  <button className="btn btn-danger flex-grow px-6 py-2 rounded-pill" onClick={decline}>Decline</button>
                </div>
              )}
               {friendStatus === 'pending' && friendRequestSender && friendRequestSender === senderId  &&(
                <button className="btn btn-warning flex-grow px-6 py-2 rounded-pill" disabled>
                  Request Sent
                </button>
              )}
              {friendStatus === 'none' && (
                <button 
                  className="btn btn-dark flex-grow px-6 py-2 rounded-pill" 
                  onClick={()=>{
                    handleAddFriend()
                  }}
                >     
                  <FontAwesomeIcon icon={faUserPlus as IconProp} /> Add Friend
                </button>
              )}
             
              
              {friendStatus === 'friends' && (
                <button className="btn btn-success flex-grow px-6 py-2 rounded-pill" disabled>
                  Friends
                </button>
              )}
              <button className="btn btn-light text-dark flex-grow px-6 py-2 rounded-pill"
              onClick={()=>navigate(`/messages/${userId}`)}
              >
                Message
              </button>
            </div>
          </div>
        </div>
      </main>

        <div className="mt-8 w-full max-w-4xl">
        <Posts userId={userId}/>
        </div>
    <Footer/>
    </div>
  );
};

export default ExternalProfile;
