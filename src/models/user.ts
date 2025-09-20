import {ObjectId, Schema, model} from 'mongoose';
import mongoose from 'mongoose';

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  wallet: number;
  Flag: boolean;
  description?: string;
  avatar?: string;
  refreshToken?: string; 
  refreshTokenExpiry?: Date; 
  googleId?: string; // Optional field for Google ID
  company_Followed: {
    company_id: mongoose.Types.ObjectId;
  }[];
}


const userSchema = new Schema<IUser>({
  name: {type: String, required: false},
  email: {type: String, required: true, unique: true, validate: {
    validator: function(value: string) {
      return value.includes('@');
  },
    message: 'Email must contain @'
  }},
  password: {type: String, required: true},
  phone: {type: String, required: false},
  wallet: {type: Number, required: false, default: 0},
  Flag: {type: Boolean, required: false, default: true},
  description: {type: String, required: false},
  avatar: {type: String, required: false},
  refreshToken: { type: String },
  refreshTokenExpiry: { type: Date, default: null },
  googleId: { type: String, required: false }, // Optional field for Google ID
  company_Followed: [
    {
      company_id: {
        type: mongoose.Types.ObjectId, 
        ref: 'Company', 
        required: false
      },
    },
  ],

});

export const UserModel = model("User", userSchema);
