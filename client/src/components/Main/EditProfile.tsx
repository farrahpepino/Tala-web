import React, { useEffect, useState, ChangeEvent, useRef } from 'react';
import { getUserData } from '../../utils/User/GetUserData';
import NavBar from '../NavBar';
import axios from 'axios';
import { storeUserData } from '../../utils/User/storeUserData';
import { useNavigate } from 'react-router-dom';
import DefaultUserIcon from '../../assets/tala/user.png';
import Footer from '../Footer';

const EditProfile = () => {
  
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>(DefaultUserIcon);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const user = getUserData();
  const [userData, setUserData] = useState({});
  const [userId, setUserId] = useState(user._id || user.userId || '');
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [bio, setBio] = useState(user.bio || '');
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://tala-web-kohl.vercel.app/api/users/${userId}`);
        setUserData(response.data);

          setProfilePicture(response.data.profile.profilePicture);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'firstName') setFirstName(value);
    if (name === 'lastName') setLastName(value);
    if (name === 'bio') setBio(value);
  };
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      setLoading(true);
      try {
        await uploadProfilePicture(file, userId);
      } catch (error) {
        alert("Error uploading file. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  


const uploadProfilePicture = async (file, userId) => {
  try {
    const res = await axios.get(`https://tala-web-kohl.vercel.app/api/users/get-presigned-url/${userId}?fileName=${file.name}&fileType=${file.type}`);
    
    if (res.status !== 200) {
      throw new Error(res.data.message);
    }

    const { url, fileKey } = res.data;

    const uploadRes = await axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    if (uploadRes.status !== 200) {
      throw new Error('Failed to upload file');
    }

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    
    const updateRes = await axios.patch(`https://tala-web-kohl.vercel.app/api/users/upload-pfp/${userId}`, { fileUrl });

    if (updateRes.status !== 200) {
      throw new Error('Failed to update profile');
    }

    console.log('Profile updated successfully:', updateRes.data.profilePicture);
  } catch (error) {
    console.error('Error uploading profile picture:', error);
  }
};

  const handleSaveChanges = async () => {
    if (!userId) {
      console.error("User ID is missing!");
      return;
    }

    const updatedUser = {
      userId,
      firstName,
      lastName,
      bio,
      profilePicture,
     
    };

    try {
      setLoading(true);
      const response = await axios.patch(
        `https://tala-web-kohl.vercel.app/api/users/profile/${userId}`,
        updatedUser
      );

      if (response.status === 200) {
        console.log("Profile updated:", response.data.user);
        storeUserData(null, response.data.user);
        navigate("/profile");
      } else {
        console.error("Failed to update profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const currentUser = getUserData();
    const userId = currentUser._id || currentUser.userId;

    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) {
      alert("Account deletion canceled.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `https://tala-web-kohl.vercel.app/api/users/${userId}/delete-account`
      );
      if (response.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.replace('/login');
        alert("Account deleted successfully!");
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="flex justify-center w-full px-4">
        <div className="w-full sm:w-[270px] md:w-[480px] lg:w-[660px] xl:w-[900px] p-6 md:p-10 shadow-lg rounded-lg">
          <div className="flex flex-col items-center -mt-16">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-0 m-0 bg-transparent leading-none appearance-none border-none"
              >
                <img
                  src={profilePicture || DefaultUserIcon}
                  alt="user-avatar"
                  className="w-32 h-32 mt-20 mb-5 border-4 border-white rounded-full"
                />
              </button>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />

            <div className="w-100 px-6">
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
            <div className="w-100 px-4 ">
              <div className="flex justify-end mt-10">
                <button
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className="btn btn-dark w-30 px-6 py-2 rounded-pill font-weight-semibold"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="btn bg-red-700 text-white hover:bg-red-400 w-30 ml-4 px-6 py-2 rounded-pill font-weight-semibold"
                >
                  {loading ? 'Deleting...' : 'Delete account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditProfile;
