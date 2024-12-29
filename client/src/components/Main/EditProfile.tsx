import React, { useEffect, useState, ChangeEvent } from 'react';
import { User } from '../../utils/User/UserType';
import { getUserData } from '../../utils/User/GetUserData';
import { handleReload } from '../../utils/HandleReload';
import NavBar from '../NavBar';
import axios from 'axios';
import { storeUserData } from '../../utils/User/storeUserData';
import { useNavigate } from 'react-router-dom';
import DefaultUserIcon from '../../assets/tala/user.png';

const EditProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      handleReload();
    } else {
      setUser(userData);
      setUserId(userData.userId || '');
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setBio(userData.bio || '');
      setProfilePicture(userData.profile?.profilePicture || '');
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'firstName') setFirstName(value);
    if (name === 'lastName') setLastName(value);
    if (name === 'bio') setBio(value);
  };

  const handleSaveChanges = async (userId) => {
    if (!userId) {
      console.error("User ID is missing!");
      return; // Stop execution if userId is not available
    }

    const updatedUser = {
      userId: user?.userId || user?._id,
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(bio && { bio }),
      ...(profilePicture && { profilePicture }),
    };

    console.log('Updated user object:', updatedUser);

    try {
      let user = getUserData();
      let userId = user?.userId || user?._id;
      const response = await axios.patch(`https://tala-web-kohl.vercel.app/api/users/profile/${userId}`, updatedUser);
      if (response.status === 200) {
        console.log('Profile updated:', response.data.user);
        storeUserData(null, response.data.user);
        const updatedUserData = getUserData();
        setUser(updatedUserData);
        console.log('Updated user data after save:', updatedUserData);
        navigate('/profile');
      } else {
        console.error('Failed to update profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="flex justify-center w-full px-4">
        <div className="w-full sm:w-[280px] md:w-[480px] lg:w-[660px] xl:w-[900px] p-6 md:p-10 shadow-lg rounded-lg">
          <div className="flex flex-col items-center -mt-16">
            <img
              src={DefaultUserIcon}
              alt="user-avatar"
              className="w-32 h-32 mt-20 mb-5 border-4 border-white rounded-full"
            />

            <div className="w-100 px-6 ">
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="form-control my-3 rounded p-2 border border-dark bg-transparent text-gray-300"
              />
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="form-control my-3 rounded p-2 border border-dark bg-transparent text-gray-300"
              />
              <textarea
                name="bio"
                value={bio}
                onChange={handleInputChange}
                placeholder="Write a short bio..."
                rows={3}
                className="form-control my-3 border-round border border-dark bg-transparent text-gray-300"
              />
            </div>
            <div className="w-100 px-4">
              <button
                onClick={handleSaveChanges}
                className="btn btn-dark btn btn-dark w-50 px-6 py-2 rounded-pill w-100 font-weight-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
