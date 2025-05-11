import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { env } from '@config/env';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  env.gmailClientId,
  env.gmailClientSecret,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: env.gmailRefreshToken,
});

/**
 * Sends a password reset email to the user.
 * @param to Recipient's email address
 * @param resetLink Full URL containing the reset token (used in the frontend)
 */
export async function sendResetPasswordEmail(to: string, resetLink: string) {
  try {
    const accessTokenObj = await oauth2Client.getAccessToken();
    const accessToken = accessTokenObj?.token;

    if (!accessToken) {
      throw new Error('Failed to retrieve access token from Google OAuth2');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: env.gmailUser,
        clientId: env.gmailClientId,
        clientSecret: env.gmailClientSecret,
        refreshToken: env.gmailRefreshToken,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `Support Team <${env.gmailUser}>`,
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
  } catch (err) {
    console.error('Failed to send reset password email:', err);
    throw err;
  }
}
