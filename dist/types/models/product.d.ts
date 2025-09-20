import { ObjectId, Schema } from 'mongoose';
export interface IProduct {
    _id: ObjectId;
    companyId: ObjectId;
    name: string;
    rating: number;
    description: string;
    price: number;
}
export declare const ProductModel: import("mongoose").Model<IProduct, {}, {}, {}, import("mongoose").Document<unknown, {}, IProduct, {}> & IProduct & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, Schema<IProduct, import("mongoose").Model<IProduct, any, any, any, import("mongoose").Document<unknown, any, IProduct, any> & IProduct & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IProduct, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IProduct>, {}> & import("mongoose").FlatRecord<IProduct> & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}>>;
