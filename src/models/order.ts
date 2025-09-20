import { ObjectId, Schema, model } from "mongoose";

// Definición de la interfaz IPedido
export interface IOrder {
  _id: ObjectId;
  user_id: ObjectId;
  products: {
    product_id: ObjectId;
    quantity: number;
    //unit_price: number;
  }[];
  company_id: ObjectId;
  orderDate: Date;
  status: string;
}


// Creación del esquema del pedido
const orderSchema = new Schema<IOrder>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      //unit_price: { type: Number, required: true }
    },
  ],
  company_id: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  orderDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Pendiente", "Enviado", "Entregado", "Cancelado", "Procesando", "Finalizada"],
    default: "Pendiente",
  },
});

// Exportación del modelo Pedido
export const OrderModel = model<IOrder>("Order", orderSchema);
