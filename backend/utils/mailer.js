const nodemailer = require('nodemailer');
const { verificationTemplate, welcomeTemplate, forgotPasswordTemplate, afterResetTemplate } = require('../controllers/emailTemplate');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

module.exports.sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.CLIENT_URL}/email/verify/${token}`;
    const htmlContent = verificationTemplate(verificationUrl);
try{
    const info = await transporter.sendMail({
        from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verify your email for Artist Platform',
        html: htmlContent
    });
}
catch (error) {
        console.error('Failed to send verification email:', error);
        return res.status(400).json({ success: false, message: "Server Error" });
    }
};

module.exports.sendWelcomeEmail = async (user) => {
    const mailOptions = {
        from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Welcome to Our Platform!',
        html: welcomeTemplate(user.name)
    };

    await transporter.sendMail(mailOptions);
};

module.exports.sendForgotPasswordEmail = async (user, resetToken) => {
    const resetUrl = `${process.env.CLIENT_URL}/api/reset-password/${resetToken}`;

    const mailOptions = {
        from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Reset Your Password',
        html: forgotPasswordTemplate(resetUrl, user.name)
    };

    await transporter.sendMail(mailOptions);
};

module.exports.afterResetPasswordEmail = async (user) => {
    const mailOptions = {
        from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Congratulations Your Password Reset',
        html: afterResetTemplate(user.name)
    };

    await transporter.sendMail(mailOptions);
};


