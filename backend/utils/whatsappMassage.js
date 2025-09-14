const axios = require('axios');
const { whatsappMassageTemplate } = require('../controllers/whatsappTemplate');

module.exports.sendWhatsAppMessage = async (data) => {
    try {
        const templateObject = whatsappMassageTemplate(data);

        const payload = {
            messaging_product: 'whatsapp',
            to: process.env.WHATSAPP_NUMBER,
            type: 'template',
            template: templateObject
        };

        const response = await axios.post(
            `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("sent whatsapp sunny")

        return {
            status: true,
            data: response.data
        };
    } catch (error) {
    console.error('WhatsApp API Error:', error.response ? error.response.data : error.message);
    return {
        status: false,
        error: error.response ? error.response.data : error.message
    };
}

};
