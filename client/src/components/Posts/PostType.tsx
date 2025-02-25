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
      return likes;
    }
    
    if (Array.isArray(likes) && likes.length > 0) {
      if ('likedBy' in likes[0]) {
        return (likes as Like[]).map((like) => ({
          likedBy: like.likedBy._id // assuming User has an _id field
        }));
      } else {
        return likes as { likedBy: string }[];
      }
    }
  
    return [];
  };