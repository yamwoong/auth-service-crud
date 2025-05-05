import { User } from './user.model';

export interface UserWithPassword extends User {
  password: string;
}
