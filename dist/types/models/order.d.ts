import { ObjectId, Schema } from "mongoose";
export interface IOrder {
    _id: ObjectId;
    user_id: ObjectId;
    products: {
        product_id: ObjectId;
        quantity: number;
    }[];
    company_id: ObjectId;
    orderDate: Date;
    status: string;
}
export declare const OrderModel: import("mongoose").Model<IOrder, {}, {}, {}, import("mongoose").Document<unknown, {}, IOrder, {}> & IOrder & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>;
