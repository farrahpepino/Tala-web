import axios from 'axios';

export const sendMessage = async (currentUserId, otherUserId, content) => {
  try {
    const response = await axios.post('https://tala-web-kohl.vercel.app/api/messages/send', {
      currentUserId,
      otherUserId,
      content
    });

    if (response.status === 200) {
      console.log('Message sent.');
    } else {
      console.error('Error sending message:', response.data.message);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
