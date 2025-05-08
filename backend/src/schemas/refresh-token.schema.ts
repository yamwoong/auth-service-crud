import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const RefreshTokenModel = mongoose.model('RefreshToken', refreshTokenSchema);
