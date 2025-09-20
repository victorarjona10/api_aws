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
exports.postPedido = postPedido;
exports.getPedidosByUserId = getPedidosByUserId;
exports.getPedidoById = getPedidoById;
exports.updatePedidoById = updatePedidoById;
exports.deletePedidoById = deletePedidoById;
exports.deleteProductFromOrder = deleteProductFromOrder;
exports.getAllCompanyOrders = getAllCompanyOrders;
const order_service_1 = require("../services/order.service");
const company_service_1 = require("../services/company.service");
const pedidosService = new order_service_1.PedidosService();
const companyService = new company_service_1.CompanyService();
function postPedido(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pedido = req.body;
            if (!pedido.user_id || !pedido.products || pedido.products.length === 0) {
                res.status(400).json({ message: "User ID, Product ID and quantity are required" });
            }
            const newPedido = yield pedidosService.postPedido(pedido);
            yield companyService.addPendingOrderToCompany(pedido.company_id.toString(), newPedido._id.toString());
            res.status(200).json(newPedido);
        }
        catch (error) {
            res.status(500).json({ message: "Error creating order", error: error.message });
        }
    });
}
function getPedidosByUserId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.idUser;
            const pedidos = yield pedidosService.getPedidosByUserId(userId);
            res.status(200).json(pedidos);
        }
        catch (error) {
            res.status(500).json({ message: "Error getting orders", error });
        }
    });
}
function getPedidoById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
            }
            const pedido = yield pedidosService.getPedidoById(id);
            if (!pedido) {
                res.status(404).json({ message: "Pedido no encontrado" });
            }
            res.status(200).json(pedido);
        }
        catch (error) {
            res.status(500).json({ message: "Error getting order", error });
        }
    });
}
function updatePedidoById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
            }
            const updatedPedido = yield pedidosService.updatePedidoById(req.params.id, req.body);
            if (!updatedPedido) {
                res.status(404).json({ message: "Pedido no encontrado" });
            }
            res.status(200).json(updatedPedido);
        }
        catch (error) {
            res.status(500).json({ message: "Error updating order", error });
        }
    });
}
function deletePedidoById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
            }
            const deletedPedido = yield pedidosService.deletePedidoById(id);
            if (!deletedPedido) {
                res.status(404).json({ message: "Pedido no encontrado" });
            }
            res.status(200).json(deletedPedido);
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting order", error: error.message });
        }
    });
}
function deleteProductFromOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleteProduct = yield pedidosService.deleteProductFromOrder(req.params.orderId, req.params.productId);
            res.status(200).json(deleteProduct);
        }
        catch (error) {
            res.status(400).json({ message: "Error updating order", error });
        }
    });
}
function getAllCompanyOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const companyId = req.params.idCompany;
            const orders = yield pedidosService.getAllCompanyOrders(companyId);
            res.status(200).json(orders);
        }
        catch (error) {
            res.status(500).json({ message: "Error getting orders", error });
        }
    });
}
//# sourceMappingURL=order.controller.js.map