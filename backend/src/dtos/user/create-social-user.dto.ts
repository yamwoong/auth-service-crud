/**
 * DTO for creating a user via social login (e.g. Google)
 */

export interface CreateSocialUserDto {
  email: string;
  name: string;
  username: string;
  provider: 'google';
  googleId: string;
}
