const express = require('express');
const router = express.Router();
const { isLogedIn } = require('../middlewares/isLogedIn')
const axios = require('axios');
const FormData = require('form-data')
const fs = require('fs')
const userModel = require('../models/User')

//whatsapp bokking
router.post('/WhatsApp', isLogedIn, async (req, res) => {

    const { date, time, service, clientMobile, message, artistId } = req.body;
    const artist = await userModel.findById(artistId);
    const client = req.user;

    try {
        await axios({
            url: `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            method: 'post',
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                messaging_product: 'whatsapp',
                to: process.env.WHATSAPP_NUMBER,
                type: 'template',
                template: {
                    name: 'booking_tamplate',
                    language: {
                        code: 'en_US'
                    },
                    components: [
                        {
                            type: 'header',
                            parameters: [
                                {
                                    type: 'text',
                                    text: process.env.COMPANY_NAME
                                }
                            ]
                        },
                        {
                            type: 'body',
                            parameters: [
                                { type: 'text', text: `${client.name}` },
                                { type: 'text', text: `${clientMobile}` },
                                { type: 'text', text: `${service}` },
                                { type: 'text', text: `${date}` },
                                { type: 'text', text: `${time}` },
                                { type: 'text', text: `${message}` },
                                { type: 'text', text: `${artist.name}` },
                                { type: 'text', text: `${artist.mobile}` }
                            ]
                        }
                    ]
                }
            })
        })
        return res.status(200).json({
            status: true,
            massage: "Booking Massage sent successfully"
        });
    } catch (error) {
        console.error("WhatsApp API Error:", error.response?.data || error.message);
        return res.status(500).json({
            status: false,
            message: "Booking Message not sent",
            error: error.response?.data || error.message
        });
    }

})

//whatsapp cunsulting
router.post('/WhatsApp/consultNow', isLogedIn, async (req, res) => {

    const { service, fullName, email, phoneNumber, location, budgetRange, projectTimeline, designPreferences, meetingType, description } = req.body;

    try {
        await axios({
            url: `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            method: 'post',
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                messaging_product: 'whatsapp',
                to: process.env.WHATSAPP_NUMBER,
                type: 'template',
                template: {
                    name: 'consult_now',
                    language: {
                        code: 'en_US'
                    },
                    components: [
                        {
                            type: 'header',
                            parameters: [
                                {
                                    type: 'text',
                                    text: process.env.COMPANY_NAME
                                }
                            ]
                        },
                        {
                            type: 'body',
                            parameters: [
                                { type: 'text', text: `${fullName}` },
                                { type: 'text', text: `${phoneNumber}` },
                                { type: 'text', text: `${service}` },
                                { type: 'text', text: `${email}` },
                                { type: 'text', text: `${location}` },
                                { type: 'text', text: `${budgetRange}` },
                                { type: 'text', text: `${projectTimeline}` },
                                { type: 'text', text: `${designPreferences}` },
                                { type: 'text', text: `${meetingType}` },
                                { type: 'text', text: `${description}` }
                            ]
                        }
                    ] 
                }
            })
        })
        return res.status(200).json({
            status: true,
            massage: "Booking Massage sent successfully"
        });
    } catch (error) {
        console.error("WhatsApp API Error:", error.response?.data || error.message);
        return res.status(500).json({
            status: false,
            message: "Booking Message not sent",
            error: error.response?.data || error.message
        });
    }

})

module.exports = router;