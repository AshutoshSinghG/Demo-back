const { sendWhatsAppMessage } = require('../utils/whatsappMassage');

module.exports.sendMessageController = async (req, res) => {
const messageData = req.body;
   try{
    await sendWhatsAppMessage(messageData);

        return res.status(200).json({
            success: true,
            message: 'WhatsApp message sent successfully',
        });
    } catch(error){
        return res.status(404).json({
            success: false,
            message: 'WhatsApp message not sent successfully',
        });
    }
};
