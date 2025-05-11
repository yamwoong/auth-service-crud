import { User } from '../models/user.model';
import { UserWithPassword, MongoUser } from '../models/user-with-password.model';

// interface MongoUser {
//   _id: any;
//   username: string;
//   email: string;
//   name: string;
//   password: string;
// }

/**
 * Convert a MongoUser to a safe User object for client response.
 *
 * @param doc MongoDB user document (includes _id, password)
 * @returns User object without sensitive fields
 */

export function mapMongoUserToUser(doc: MongoUser): User {
  return {
    id: doc._id.toString(),
    username: doc.username,
    email: doc.email,
    name: doc.name,
  };
}

/**
 * Convert a MongoUser to a UserWithPassword object (for internal use only).
 *
 * @param doc MongoDB user document
 * @returns User object including password (used for auth logic)
 */

export function mapMonGoUserToUserWithPassword(doc: MongoUser): UserWithPassword {
  return {
    ...mapMongoUserToUser(doc),
    password: doc.password,
  };
}

/**
 * Convert a Google-authenticated MongoUser to a User object including provider info.
 *
 * @param doc MongoUser created via Google OAuth
 * @returns User object including optional Google-specific fields
 */

export function mapMongoGoogleUserToUser(doc: MongoUser): User {
  return {
    id: doc._id.toString(),
    username: doc.username,
    email: doc.email,
    name: doc.name,
    provider: doc.provider,
    googleId: doc.googleId,
  };
}
