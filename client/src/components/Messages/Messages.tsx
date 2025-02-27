import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar';
import ChatList from './ChatList';
import ChatBubble from './ChatBubble';
import DefaultUserIcon from '../../assets/tala/user.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import Footer from '../Footer';
import axios from 'axios';
import { getUserData } from '../../utils/User/GetUserData';
import { User } from '../../utils/User/UserType';
import { useParams } from 'react-router-dom';
import { sendMessage } from './MessagesService';




const Messages = () => {
  const { userId } = useParams<{ userId: string }>();
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const userData = getUserData();
  const currentUserId = userData.userId;
  const otherUserId = userId; 

  const fetchUserData = async () => {
    if (!otherUserId) return;
    try {
      const response = await axios.get(`https://tala-web-kohl.vercel.app/api/users/${otherUserId}`);
      setOtherUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        await sendMessage(currentUserId, otherUserId, message);
        setMessage(''); 
        fetchMessages(chatId);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  useEffect(() => {
    if (otherUserId) {
      fetchUserData();
    }
  }, [otherUserId]);
  

  const otherUserFullName = otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : '';

  const getChatId = async () => {
    if (!currentUserId || !otherUserId) return;
    try {
      const response = await axios.get(`https://tala-web-kohl.vercel.app/api/messages/chatId/${currentUserId}/${otherUserId}`
     
      );
      const id = response.data.chatId;
      setChatId(id);
    } catch (error) {
      console.error('Error fetching chatId:', error);
    }
  };
  useEffect(() => {
    if (currentUserId && otherUserId) {
      getChatId();
    }
  }, [currentUserId, otherUserId]);

  const fetchMessages = async (chatId: string | null) => {
    if (!chatId) return;
    try {
      const response = await axios.get(`https://tala-web-kohl.vercel.app/api/messages/${chatId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
    }
  }, [chatId]);

  
  return (
<div style={{ margin: 0, padding: 0, height: '94vh', overflow: 'hidden' }} className="text-gray-200">
  <NavBar />

  <div className="mt-5 grid grid-cols-12 w-full">
    <div className="col-span-4 bg-transparent">
      <div className="flex flex-row justify-between items-center w-full">
        <p className="text-xl font-semibold text-gray-200">Chats</p>
        {/* <button className="flex items-center justify-center px-4 py-2 w-12 h-12 bg-gray-800 text-white font-medium rounded-full shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2">
          <FontAwesomeIcon className="-ml-0.8" icon={faPen as IconProp} />
        </button> */}
      </div>
      <ChatList currentUserId={currentUserId} />
    </div>

    {
              otherUserId === 'null' ? (
                <div className='justify-center w-full'>
                {/* <input
                  type="text"
                  placeholder="To:"
                  className=" text-gray-600 p-2 rounded w-[95%] h-10 mt-2 border-1 items-center justify-center content-around bg-gray-800 bg-opacity-5 px-4 py-2 focus:outline-none"
                /> */}
                </div>
              ) : (
                <>
    <div className="col-span-8 bg-gray-100 bg-opacity-10 flex  flex-col max-h-[calc(100vh-100px)] rounded">
      <div className="flex items-center  rounded-t-none bg-black bg-opacity-25 pb-2 text-gray-100">
     
                  <div className="flex items-start py-4 ml-2">
                    <img src={DefaultUserIcon} className="object-cover h-8 w-8 rounded-full" alt="Avatar" />
                  </div>
                  <h3 className="flex items-start text-lg font-semibold p-4 -ml-3">
                    {otherUserFullName}
                  </h3>
               
      </div>

      <div className="flex flex-col overflow-y-auto px-2 max-h-[calc(100vh-100px)] py-2 flex-grow">
        <div className="space-y-2">
          {messages.map((msg) => (
            <ChatBubble 
            key={msg.messageId} 
            message={msg.content} 
            isSent={msg.sender.userId === currentUserId}
            avatar={msg.sender.profilePicture || DefaultUserIcon} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center content-around bg-gray-800 bg-opacity-5 p-2">
      <form 
      className="flex w-full"
       onSubmit={handleSendMessage}>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message"
          className="flex-grow bg-black bg-opacity-25 rounded-full text-gray-200 placeholder-gray-400 px-4 py-2 focus:outline-none"
        />
        <button type="submit" className="px-3 py-2 rounded-full text-white bg-gray-800 hover:bg-gray-400"
                  disabled={!message.trim()}
                  >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
        </form>
      </div>
    </div>
    </>
              )
            }
  </div>

  <Footer />
</div>

  
  );
};

export default Messages;