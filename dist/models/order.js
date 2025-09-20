"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            product_id: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: { type: Number, required: true },
        },
    ],
    company_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Company", required: true },
    orderDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["Pendiente", "Enviado", "Entregado", "Cancelado"],
        default: "Pendiente",
    },
});
exports.OrderModel = (0, mongoose_1.model)("Order", orderSchema);
//# sourceMappingURL=order.js.map