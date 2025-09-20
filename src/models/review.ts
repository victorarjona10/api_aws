import {ObjectId, Schema, model} from 'mongoose';

export interface IReview {
  _id: ObjectId;
  user_id: ObjectId;
  company_id: ObjectId;
  rating: number;
  description: string;
  date: Date;
}


const reviewSchema = new Schema<IReview>({
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    company_id: {type: Schema.Types.ObjectId, ref: 'Company', required: true},
    rating: {type: Number, required: true},
    description: {type: String, required: true},
    date: {type: Date, default: Date.now},
});

export const ReviewModel = model<IReview>('Review', reviewSchema);