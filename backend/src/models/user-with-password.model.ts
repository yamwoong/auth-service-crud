import { User } from './user.model';
import { Types } from 'mongoose';

export interface UserWithPassword extends User {
  password?: string | null;
}

export interface MongoUser extends Omit<UserWithPassword, 'id'> {
  _id: Types.ObjectId;
  provider?: 'local' | 'google';
  googleId?: string;
}
