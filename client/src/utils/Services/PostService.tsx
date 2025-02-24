import axios from "axios"

export const deletePost = async (userId, postId) => {

    try {
        const response = await axios.delete(`https://tala-web-kohl.vercel.app/api/post/${userId}/${postId}/delete`);
        return response.data;
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
};

export const likePost = async(userId, postId) => {
    try {
        const response = await axios.post(`https://tala-web-kohl.vercel.app/api/post/${postId}/like`, {userId: userId});
        return response.data;
    } catch (error) {
        console.error("Error liking post:", error);
        throw error;
    }

}

export const unlikePost = async(userId, postId) => {
    try {
        const response = await axios.post(`https://tala-web-kohl.vercel.app/api/post/${postId}/unlike`, {userId: userId});
        return response.data;
    } catch (error) {
        console.error("Error liking post:", error);
        throw error;
    }

}
