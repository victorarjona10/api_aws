"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const product_controller_1 = require("../controllers/product.controller");
router.get("/", product_controller_1.getAllProducts);
router.post("/", product_controller_1.postProduct);
router.get('/:id', product_controller_1.getProductById);
router.put('/:id', product_controller_1.updateProductById);
router.delete('/:id', product_controller_1.deleteProductById);
exports.default = router;
//# sourceMappingURL=product.routes.js.map