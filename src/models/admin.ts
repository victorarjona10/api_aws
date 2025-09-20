import { ObjectId, Schema, model } from "mongoose";

export interface IAdmin {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  password2: string;
  Flag: boolean;
  refreshToken?: string; 
  refreshTokenExpiry?: Date; 
  //reservas--productos
}


const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true, validate: {
    validator: function(value: string) {
      return value.includes('@');
  },
    message: 'Email must contain @'
  }},
  password: { type: String, required: true },
  phone: { type: String, required: false },
  password2: { type: String, required: true },
  Flag: { type: Boolean, required: false, default: true },
  refreshToken: { type: String },
  refreshTokenExpiry: { type: Date, default: null },

  
});

export const AdminModel = model("Admin", AdminSchema);
