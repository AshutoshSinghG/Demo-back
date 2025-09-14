module.exports.whatsappMassageTemplate = (data) => {
    return {
        name: "hello_world",          // Must exactly match approved template name in WhatsApp Business Manager
        language: {
            code: "en_US"
        },
        components: [
            {
                type: "body",
                parameters: [
                    { type: "text", text: data.email },
                    { type: "text", text: data.password }
                ]
            }
        ]
    };
};
