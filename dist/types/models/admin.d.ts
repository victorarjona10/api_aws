import { ObjectId, Schema } from "mongoose";
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
}
export declare const AdminModel: import("mongoose").Model<IAdmin, {}, {}, {}, import("mongoose").Document<unknown, {}, IAdmin, {}> & IAdmin & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, Schema<IAdmin, import("mongoose").Model<IAdmin, any, any, any, import("mongoose").Document<unknown, any, IAdmin, any> & IAdmin & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IAdmin, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IAdmin>, {}> & import("mongoose").FlatRecord<IAdmin> & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}>>;
