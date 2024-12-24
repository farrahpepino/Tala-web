import { User } from "../../utils/User/UserType";
export interface Post {
    id: string;
    userName: string;
    userAvatar: string;
    description: string;
    createdAt: string;
    likes: number;
    comments: Array<{
      text: string;
      createdAt: string;
      postedBy: User | string; 
    }>;
    postedBy: string | User;
 
  }