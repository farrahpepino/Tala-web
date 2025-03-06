import React, { useEffect, useState, ChangeEvent, useRef } from 'react';
import { User } from '../../utils/User/UserType';
import { getUserData } from '../../utils/User/GetUserData';
import { handleReload } from '../../utils/HandleReload';
import NavBar from '../NavBar';
import axios from 'axios';
import { storeUserData } from '../../utils/User/storeUserData';
import { useNavigate } from 'react-router-dom';
import DefaultUserIcon from '../../assets/tala/user.png';
import Footer from '../Footer';

const EditProfile = () => {
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>(DefaultUserIcon);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const user = getUserData();

  useEffect(() => {
    
      setUserId(user._id || user.userId || '');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setBio(user.bio || '');

      if (user.profile && user.profile.profilePicture) {
        setProfilePicture(user.profile.profilePicture);
      } else {
        setProfilePicture(DefaultUserIcon);
      }
    
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'firstName') setFirstName(value);
    if (name === 'lastName') setLastName(value);
    if (name === 'bio') setBio(value);
  };
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      
      
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      
    //   try {
    //     const response = await axios.post(
    //       `https://tala-web-kohl.vercel.app/api/users/add-pfp/${user._id}`,
    //       formData
    //       ,{
    //         headers: {
    //           'Content-Type': 'multipart/form-data',
    //         },
    //       }
    //     );
    //     console.log(response);


  
    //     if (response.data && response.data.fileUrl) {
    //       setProfilePicture(response.data.fileUrl); // Update profile picture
    //       console.log('File uploaded successfully:', response.data);
    //     } else {
    //       console.error('File upload failed:', response.data);
    //     }
    //   } catch (error) {
    //     // console.error("Error uploading profile picture:", error);
    //     alert("Error uploading file. Please try again.");
    //   } finally {
    //     setLoading(false);
    //   }
    
    try {
      const response = await axios.post(`/api/users/add-pfp/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      if (response.status === 200) {
        console.log('File uploaded successfully:', response);
      } else {
        console.error('Failed to upload file:', response);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
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
      profile: {
        profilePicture,
      },
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
            <form>
            <input
              type="file"
              name="file"              
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            </form>

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
            <div className="w-100 px-4 ">
              <div className='flex justify-end mt-10'>
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
