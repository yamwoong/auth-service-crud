import querystring from 'querystring';
import axios from 'axios';
import { env } from '@config/env';

/**
 * Generate Google OAuth2 authorization URL
 *
 * @returns {string} - URL to redirect user to Google OAuth2 login
 * @usage Used in GET /auth/google to redirect users to the Google login page
 */

export const buildGoogleOAuthURL = (): string => {
  const clientId = env.googleClientId;
  const redirectUri = env.googleCallbackUrl;

  const scope = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ].join(' ');

  const params = querystring.stringify({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

/**
 * Exchange authorization code for access token from Google
 *
 * @param code Authorization code received from Google
 * @returns {Promise<{ access_token: string, ... }>} Access token and other token info
 * @usage Called in GET /auth/google/callback to exchange code for access_token
 */

export const getGoogleTokens = async (code: string) => {
  const response = await axios.post(
    'https://oauth2.googleapis.com/token',
    {
      code,
      client_id: env.googleClientId,
      client_secret: env.googleClientSecret,
      redirect_uri: env.googleCallbackUrl,
      grant_type: 'authorization_code',
    },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};

/**
 * Fetch user's profile information from Google using access_token
 *
 * @param accessToken Access token obtained from Google
 * @returns {Promise<{ email: string, name: string, id: string }>} Basic user info
 * @usage Called in GET /auth/google/callback after receiving access_token
 */

export const getGoogleUserInfo = async (accessToken: string) => {
  const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};
