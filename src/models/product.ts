import {ObjectId, Schema, model} from 'mongoose';

export interface IProduct {
  _id: ObjectId;
  companyId: ObjectId;
  name: string;
  rating: number;
  description: string;
  price: number;
  available: boolean;
  image?: string;
  category?: string;
  stock?: number;
}



const productSchema = new Schema<IProduct>({
    companyId: { type: Schema.Types.ObjectId, ref: "Company" , required: true},
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, required: true, default: false },
    image: { type: String, required: false, default: "" },
    category: { type: String, required: false },
    stock: { type: Number, required: false, default: 0 },
  });
  
  export const ProductModel = model("Product", productSchema);