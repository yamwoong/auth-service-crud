import mongoose, { Document } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    password: {
      type: String,
      required: function (this: Document & { provider?: string }) {
        return this.get('provider') === 'local';
      },
      default: null,
      select: false,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);
