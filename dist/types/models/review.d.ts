import { ObjectId, Schema } from 'mongoose';
export interface IReview {
    _id: ObjectId;
    user_id: ObjectId;
    company_id: ObjectId;
    rating: number;
    description: string;
    date: Date;
}
export declare const ReviewModel: import("mongoose").Model<IReview, {}, {}, {}, import("mongoose").Document<unknown, {}, IReview, {}> & IReview & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>;
