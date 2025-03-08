import axios from "axios"


export const addProfilePhoto = async (userId, profilePhoto) => {
    try {
        const response = await axios.post(
            `https://tala-web.onrender.com/api/users/${userId}/add-profile-photo`, 
            { profilePhoto } 
        );
        return response.data; 
    } catch (error) {
        console.error('Error updating profile photo:', error.response?.data || error.message);
        throw error; 
    }
};


export const getProfilePhoto = async (userId) => {
    try {
        const response = await axios.post(
            `https://tala-web.onrender.com/api/users/${userId}/profile-photo`, 
        );
        return response.data; 
    } catch (error) {
        console.error('Error getting profile photo:', error.response?.data || error.message);
        throw error; 
    }
}