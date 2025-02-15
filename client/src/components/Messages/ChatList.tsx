import React, {useEffect, useState} from 'react';
import DefaultUserIcon from '../../assets/tala/user.png';
import axios from 'axios';

interface Participant {
  userId: string;
  name: string;
}

interface Chat {
  chatId: string;
  name: string;
  participants: Participant[];
  latestMessage: string;
  latestMessageSender: string;
  latestMessageTime: string | null;
}

interface ChatListProps {
  currentUserId: string;
}

const ChatList: React.FC<ChatListProps> = ({ currentUserId }) => {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (currentUserId) {
      const fetchChatList = async () => {
        try {
          const response = await axios.get(`http://localhost:5005/api/messages/chatList/${currentUserId}`);
          setChats(response.data);
        } catch (error) {
          console.error('Error fetching chat list:', error);
        }
      };
      fetchChatList();
    }
  }, [currentUserId]);

  return (
    <div 
    style={{maxHeight:'65%'}}
    className="flex flex-col overflow-y-auto">
   <div className="flex flex-col items-start space-y-4 p-4 rounded-lg shadow-md">
   
</div>

      <div className="max-sm px-2">
        <input
          type="text"
          placeholder="Search chat"
          className="w-full pl-10 -mt-3 border border-dark bg-transparent rounded  text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-highlight focus:border-transparent" 

        />
      </div>
      <div className="flex">
    <aside className="h-screen sticky top-0">
      {chats.map((chat) => (
        <div
          key={chat.chatId}
          className="flex flex-row py-4 px-10 items-start"
        >
      <div className=" grid grid-cols-12 gap-4">
      <div className=" col-span-3">

            <img
              src={DefaultUserIcon}
              className="h-8 w-8 rounded-full"
              alt={chat.name}
            />
          </div>
          <div className="col-span-9">

          <div className="w-full hidden sm:block">
            <div className='flex items-start'>
            <div className="text-lg font-semibold text-gray-300">{chat.name}</div>
            </div>
            <div className='flex items-start'>

          <div>{chat.latestMessageSender === chat.name ? chat.name : "You"}:{' '}
                      </div>
                      <div className="text-gray-400"> {chat.latestMessage}</div>          </div>
      

          </div>
          
          
          </div>
          
          
        </div>
        
        </div>
        
      ))}
      </aside>
      </div>
    </div>
  );
};

export default ChatList;
