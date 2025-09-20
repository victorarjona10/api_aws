"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidosService = void 0;
const order_1 = require("../models/order");
class PedidosService {
    postPedido(pedido) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPedido = new order_1.OrderModel(pedido);
            return yield newPedido.save();
        });
    }
    getPedidosByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_1.OrderModel.find({ user_id: userId }).populate('user_id').populate('products.product_id').exec();
        });
    }
    getPedidoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_1.OrderModel.findById(id).populate('user_id').populate('products.product_id').exec();
        });
    }
    updatePedidoById(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (updateData.products && Array.isArray(updateData.products)) {
                const updates = updateData.products.map(product => ({
                    updateOne: {
                        filter: { _id: id, "products.product_id": product.product_id },
                        update: { $set: { "products.$.quantity": product.quantity } },
                    }
                }));
                yield order_1.OrderModel.bulkWrite(updates);
                const otherFields = Object.assign({}, updateData);
                delete otherFields.products;
                if (Object.keys(otherFields).length > 0) {
                    return yield order_1.OrderModel.updateOne({ _id: id }, { $set: otherFields });
                }
                return { message: "Update successful" };
            }
        });
    }
    deletePedidoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_1.OrderModel.findByIdAndDelete(id);
        });
    }
    deleteProductFromOrder(orderId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield order_1.OrderModel.updateOne({ _id: orderId }, { $pull: { products: { product_id: productId } } });
            if (result.modifiedCount === 0) {
                throw new Error("No se encontró el producto o el pedido");
            }
            return { message: `Product deleted from order with id: ${orderId}` };
        });
    }
    getAllCompanyOrders(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_1.OrderModel.find({ company_id: companyId }).populate('user_id').populate('products.product_id').exec();
        });
    }
}
exports.PedidosService = PedidosService;
//# sourceMappingURL=order.service.js.map