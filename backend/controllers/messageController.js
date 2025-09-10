const Message = require('../models/Message');
const User = require('../models/User');

module.exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user._id;

        // Validate receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: 'Receiver not found'
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        await newMessage.save();
        receiver.massages.push(newMessage._id)
        await receiver.save();

        return res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        });

    } catch (error) {
        console.error('Error sending message:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
