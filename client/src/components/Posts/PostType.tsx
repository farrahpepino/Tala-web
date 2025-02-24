import { User } from "../../utils/User/UserType";
export interface Post {
    id: string;
    _id: string;
    userName: string;
    userAvatar: string;
    description: string;
    createdAt: string;
    likes: number;
    comments: Comment[];
    postedBy: string | User;
 
  }

  export interface Comment {
    text: string;
    createdAt: string;
    postedBy: string | User;
  }