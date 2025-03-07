const User = require('../models/userModel')
const Chat = require('../models/ChatModel')

exports.sendMessage = async (req, res) => {
    const { currentUserId, otherUserId, content } = req.body;

    if (!currentUserId || !otherUserId || !content) {
        return res.status(400).json({ message: "CurrentUserId, OtherUserId, and content are required." });
    }

    const participants = [currentUserId, otherUserId];

    try {
        let chat = await Chat.findOne({
            participants: { $all: participants, }
                // $size: participants.length }
        }).populate('participants'); 
        if (!chat) {
            chat = new Chat({
                participants
            });
            await chat.save();
        }

        chat.messages.push({
            sender: currentUserId,
            content,
            sentAt: new Date()
        });

        await chat.save();

        await chat.populate('messages.sender', 'firstName lastName profile.profilePicture');

        return res.status(200).json({ message: "Message sent successfully!", chat });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while sending the message." });
    }
};




exports.getChatId = async (req, res) => {
    const { currentUserId, otherUserId } = req.params;
    if (!currentUserId || !otherUserId) {
        return res.status(400).json({ message: "currentUserId and otherUserId are required." });
      }
      

    try {
        const chat = await Chat.findOne({
            participants: { $all: [currentUserId, otherUserId] }
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found.", chatId: null });
        }

        return res.status(200).json({ chatId: chat._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while retrieving the chatId." });
    }
};


exports.getMessages = async (req, res) => {
    const { chatId } = req.params;

    if (!chatId) {
        return res.status(400).json({ message: "ChatId is required." });
    }

    try {
        const chat = await Chat.findById(chatId)
            .populate('participants', 'firstName lastName profilePicture') 
            .populate({
                path: 'messages.sender',
                select: 'firstName lastName profile.profilePicture', 
            });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found." });
        }

        const formattedMessages = chat.messages.map(msg => ({
            messageId: msg._id, 
            content: msg.content, 
            sentAt: msg.sentAt, 
            sender: {
                firstName: msg.sender.firstName,
                lastName: msg.sender.lastName,
                userId: msg.sender._id,
                profilePicture: msg.sender.profilePicture, 
            },
        }));

        return res.status(200).json({ messages: formattedMessages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while retrieving the messages." });
    }
};

exports.getChatList = async (req, res) => {
    try {
      const currentUserId = req.params.currentUserId;
  
      if (!currentUserId) {
        return res.status(400).json({ message: "currentUserId is required." });
      }
  
      const chats = await Chat.find({ participants: { $in: [currentUserId] } })
        .populate('participants', 'firstName lastName profile.profilePicture')
        .populate({
          path: 'messages',
          select: 'content sender sentAt',
          options: { sort: { sentAt: -1 }, limit: 1 },
          populate: { path: 'sender', select: 'firstName lastName profile.profilePicture' },
        })
        .sort({ 'messages.sentAt': -1 })
        .limit(10)
        .lean();
  
      const chatList = chats.map((chat) => {
        const otherParticipant = chat.participants.find(
          (p) => p._id.toString() !== currentUserId
        );
  
        const latestMessage = chat.messages.length ? chat.messages[0] : null;
  
        return {
          chatId: chat._id,
          otherParticipantId: otherParticipant._id,
          name: otherParticipant
            ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
            : 'Unknown',
          latestMessage: latestMessage ? latestMessage.content : '',
          latestMessageSender: latestMessage
            ? `${latestMessage.sender.firstName} ${latestMessage.sender.lastName}`
            : '',
          latestMessageTime: latestMessage ? latestMessage.sentAt : null,
        };
      });
  
      res.json(chatList);
    } catch (error) {
      console.error('Error fetching chat list:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  