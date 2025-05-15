"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = sendResetPasswordEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const env_1 = require("@config/env");
const OAuth2 = googleapis_1.google.auth.OAuth2;
const oauth2Client = new OAuth2(env_1.env.gmailClientId, env_1.env.gmailClientSecret, 'https://developers.google.com/oauthplayground');
oauth2Client.setCredentials({
    refresh_token: env_1.env.gmailRefreshToken,
});
/**
 * Sends a password reset email to the user.
 * @param to Recipient's email address
 * @param resetLink Full URL containing the reset token (used in the frontend)
 */
async function sendResetPasswordEmail(to, resetLink) {
    try {
        const accessTokenObj = await oauth2Client.getAccessToken();
        const accessToken = accessTokenObj?.token;
        if (!accessToken) {
            throw new Error('Failed to retrieve access token from Google OAuth2');
        }
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: env_1.env.gmailUser,
                clientId: env_1.env.gmailClientId,
                clientSecret: env_1.env.gmailClientSecret,
                refreshToken: env_1.env.gmailRefreshToken,
                accessToken: accessToken,
            },
        });
        const mailOptions = {
            from: `Support Team <${env_1.env.gmailUser}>`,
            to,
            subject: 'Reset Your Password',
            html: `
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <a href="${resetLink}" target="_blank" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:white;border-radius:4px;text-decoration:none;">
          Reset Password
        </a>
        <p>This link will expire in 10 minutes for your security.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thanks,<br/>The Support Team</p>
      `,
        };
        const result = await transporter.sendMail(mailOptions);
        return result;
    }
    catch (err) {
        console.error('Failed to send reset password email:', err);
        throw err;
    }
}
