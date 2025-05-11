export interface User {
  id: string; // MongoDB _id converted to string
  username: string;
  email: string;
  name: string;
  provider?: 'local' | 'google';
  googleId?: string;
}
