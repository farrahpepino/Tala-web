import axios from "axios"
import { LikeListResponse } from "../../components/Posts/PostType";

export const deletePost = async (userId, postId) => {

    try {
        const response = await axios.delete(`https://tala-web.onrender.com/api/post/${userId}/${postId}/delete`);
        return response.data;
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
};

export const likePost = async(userId, postId) => {
    try {
        const response = await axios.post(`https://tala-web.onrender.com/api/post/${postId}/like`, {userId: userId});
        return response.data;
    } catch (error) {
        console.error("Error liking post:", error);
        throw error;
    }

}

export const unlikePost = async(userId, postId) => {
    try {
        const response = await axios.post(`https://tala-web.onrender.com/api/post/${postId}/unlike`, {userId: userId});
        return response.data;
    } catch (error) {
        console.error("Error liking post:", error);
        throw error;
    }

}

export const formatNumber = (num: number): string => {
  
    if (num >= 1_000_000_000_000) {
      return (num / 1_000_000_000_000).toFixed(1).slice(0, 3) + 'T'; 
    }
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).slice(0, 3) + 'B'; 
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).slice(0, 3) + 'M'; 
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).slice(0, 3) + 'k'; 
    }
    return num.toString().slice(0, 3); 
};
  


  