import { ObjectId, Schema } from 'mongoose';
export interface ICompany {
    _id: ObjectId;
    ownerId: ObjectId;
    name: string;
    rating: number;
    userRatingsTotal: number;
    description: string;
    location: string;
    email: string;
    phone: string;
    password: string;
    wallet: number;
    products: ObjectId[];
    coordenates_lat: number;
    coordenates_lng: number;
    icon: string;
    photos?: string[];
    followers: number;
    reviews?: ObjectId[];
    pendingOrders?: ObjectId[];
}
export declare const CompanyModel: import("mongoose").Model<ICompany, {}, {}, {}, import("mongoose").Document<unknown, {}, ICompany, {}> & ICompany & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, Schema<ICompany, import("mongoose").Model<ICompany, any, any, any, import("mongoose").Document<unknown, any, ICompany, any> & ICompany & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ICompany, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ICompany>, {}> & import("mongoose").FlatRecord<ICompany> & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}>>;
