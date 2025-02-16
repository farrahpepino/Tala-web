import axios from "axios"

export const deletePost = async (userId, postId) => {

    try {
        const response = await axios.delete(`http://localhost:5005/api/post/${userId}/${postId}/delete`);
        return response.data;
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
};