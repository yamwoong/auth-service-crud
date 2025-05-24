import { Schema, model, Document, Types } from 'mongoose';

// Extend Mongoose Document to include our Post fields
export interface PostDocument extends Document {
  title: string; // title of the post
  content: string; // content/body of the post
  authorId: Types.ObjectId; // MongoDB ObjectId referencing the User
  createdAt: Date; // timestamp when the document was created
  updatedAt: Date; // timestamp when the document was last updated
}

// Define the schema for the Post collection
const PostSchema = new Schema<PostDocument>(
  {
    // Title field: required, trimmed to remove leading/trailing spaces
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Content field: required, free-form string
    content: {
      type: String,
      required: true,
    },
    // AuthorId field: required, references the 'User' collection
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    // Automatically manage createdAt and updatedAt properties
    timestamps: true,
    // Disable version key (__v) if not needed
    versionKey: false,
  }
);

// Create and export the Mongoose model for use in repositories/services
export const PostModel = model<PostDocument>('Post', PostSchema);
