import { User } from "../../utils/User/UserType";
export interface Post {
    id: string;
    _id: string;
    userName: string;
    userAvatar: string;
    description: string;
    createdAt: string;
    likes: number;
    comments: { text: string; createdAt: string; postedBy: string | User }[];
    postedBy: string | User;
 
  }