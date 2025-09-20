"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const session_1 = require("../middleware/session");
const router = (0, express_1.Router)();
router.post("/", session_1.checkJwt, order_controller_1.postPedido);
router.get('/:id', session_1.checkJwt, order_controller_1.getPedidoById);
router.put('/:id', session_1.checkJwt, order_controller_1.updatePedidoById);
router.delete('/:id', session_1.checkJwt, order_controller_1.deletePedidoById);
router.get("/AllOrdersByUser/:idUser", session_1.checkJwt, order_controller_1.getPedidosByUserId);
router.put('/:orderId/:productId', session_1.checkJwt, order_controller_1.deleteProductFromOrder);
router.get("/AllOrdersByCompany/:idCompany", session_1.checkJwt, order_controller_1.getAllCompanyOrders);
exports.default = router;
//# sourceMappingURL=order.routes.js.map