import { ObjectId, Schema } from 'mongoose';
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
    googleId?: string;
    company_Followed: {
        company_id: mongoose.Types.ObjectId;
    }[];
}
export declare const UserModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, Schema<IUser, mongoose.Model<IUser, any, any, any, mongoose.Document<unknown, any, IUser, any> & IUser & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IUser, mongoose.Document<unknown, {}, mongoose.FlatRecord<IUser>, {}> & mongoose.FlatRecord<IUser> & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}>>;
