import { User } from '../models/user.model';
import { UserWithPassword } from '../models/user-with-password.model';

interface MongoUser {
  _id: any;
  username: string;
  email: string;
  name: string;
  password: string;
}

export function mapMongoUserToUser(doc: MongoUser): User {
  return {
    id: doc._id.toString(),
    username: doc.username,
    email: doc.email,
    name: doc.name,
  };
}

export function mapMonGoUserToUserWithPassword(doc: MongoUser): UserWithPassword {
  return {
    ...mapMongoUserToUser(doc),
    password: doc.password,
  };
}
