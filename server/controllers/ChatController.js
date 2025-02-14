const User = require('../models/userModel')
const Chat = require('../models/ChatModel')


exports.sendMessage = async (req, res) =>{
    
    const {currentUserId, otherUserIds, content} = req.body;

    if (!currentUserId || !otherUserIds || !content) {
        return res.status(400).json({ message: "CurrentUserId, OtherUserId, and content are required." });
    }

    const participants = [currentUserId, ...otherUserIds];

    try{

        let chat = await Chat.findOne({
            participants: { $all: participants, $size: participants.length }
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
        })

        await chat.save();
        return res.status(200).json({ message: "Message sent successfully!", chat });




    }
    catch(error){
        return res.status(500).json({ message: "An error occurred while sending the message." });
    }

}



exports.getChatId = async (req, res) => {
    const { currentUserId, otherUserId } = req.body;

    if (!currentUserId || !otherUserId) {
        return res.status(400).json({ message: "currentUserId and otherUserId are required." });
    }

    try {
        const chat = await Chat.findOne({
            participants: { $all: [currentUserId, otherUserId] }
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found." });
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
        const chat = await Chat.findById(chatId).populate('participants');

        if (!chat) {
            return res.status(404).json({ message: "Chat not found." });
        }

        return res.status(200).json({ messages: chat.messages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while retrieving the messages." });
    }
};
