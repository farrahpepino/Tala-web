import { User } from "../../utils/User/UserType";

type Likes = number | { likedBy: string }[] | Like[];

export interface Post {
    id: string;
    _id: string;
    userName: string;
    userAvatar: string;
    description: string;
    createdAt: string;
    likes: Likes;
    comments: Comment[];
    postedBy: string | User;
    
  }


  export interface Comment {
    content?: string;
    commentedAt?: string;
    commentBy?: string | User;
    _id: string;
    id:string; 
   
  }

 export interface Like {
    likedBy: User;
  }
  
  export interface LikeListResponse {
    likedBy: Like[]; 
  }

  export const transformLikesToString = (likes: Likes): { likedBy: string }[] | number => {
    if (typeof likes === 'number') {
      return likes;  // Return number if likes is a count
    }
  
    if (Array.isArray(likes) && likes.length > 0) {
      // Check if likes have the `likedBy` property referring to User object
      if ('likedBy' in likes[0] && typeof likes[0].likedBy === 'object') {
        // Assuming likedBy is an object with _id, map to just the _id
        return (likes as Like[]).map((like) => ({
          likedBy: like.likedBy._id // Extracting the user ID
        }));
      } else {
        // Return as is if already in { likedBy: string } format
        return likes as { likedBy: string }[];
      }
    }
  
    return [];  // Return empty array if no likes exist
  };
  