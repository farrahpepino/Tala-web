import React, { useState, useEffect } from 'react';
import AddPost from '../Posts/AddPost';
import { useNavigate } from 'react-router-dom';
import { User } from '../../utils/User/UserType';
import { getUserData } from '../../utils/User/GetUserData';
import { handleReload } from '../../utils/HandleReload';
import NavBar from '../NavBar';
import Posts from '../Posts/Posts';
import DefaultUserIcon from '../../assets/tala/user.png';
import Footer from '../Footer';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      handleReload();
    } else {
      setUser(userData);
    }
  }, []);

  console.log(user?.userId)
  return (
    <div className="min-h-screen mx-auto">
    <NavBar />
    <main className="flex flex-grow justify-center w-full px-4">
        <div className="w-full sm:w-[280px] md:w-[480px] lg:w-[660px] xl:w-[900px] p-6 md:p-10 shadow-lg rounded-lg">
          <div className="flex flex-col items-center -mt-16">
          <img
            src = {DefaultUserIcon}
            alt="user-avatar"
            className="w-32 h-32 mt-20 border-4 border-white rounded-full"
          />
        <h3 className="text-2xl font-bold text-gray-300 mt-4">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-sm text-gray-400 text-center">{user?.bio}</p>
        
        <div className="flex gap-2 mt-3" style={{ maxWidth: '290px', width: '100%' }}>
          <button
            onClick={() => navigate('/edit-profile')}
            className="btn btn-light text-dark flex-grow px-6 py-2 rounded-pill"
          >
            Edit Profile
          </button>
        </div>
        </div>
      </div>
    </main>

      <div className="mt-4 mx-auto w-full max-w-4xl">
        <AddPost />
        <Posts userId={user?.userId || user?._id}/>
      </div>
      <Footer/>
    </div>
  );
};

export default Profile;
