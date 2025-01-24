import React from 'react';

const ChatBubble = ({ message, isSent, avatar }) => {
  return (
    <div
      className={`flex mb-1 ${
        isSent ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isSent && (
        <img
          src={avatar}
          className="object-cover h-8 w-8 rounded-full"
          alt="Avatar"
        />
      )}
      <div
        className={`py-1 px-3 rounded-full text-white bg-opacity-50 ${
          isSent
            ? 'bg-black'
            : 'bg-white'
        }`}
      >
        {message}
      </div>
      {isSent && (
        <img
          src={avatar}
          className="object-cover h-8 w-8 rounded-full"
          alt="Avatar"
        />
      )}
    </div>
  );
};

export default ChatBubble;
