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
exports.postProduct = postProduct;
exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
exports.updateProductById = updateProductById;
exports.deleteProductById = deleteProductById;
const product_service_1 = require("../services/product.service");
const company_service_1 = require("../services/company.service");
const productService = new product_service_1.ProductService();
const companyService = new company_service_1.CompanyService();
function postProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            try {
                const product = req.body;
            }
            catch (error) {
                res.status(400).json({ message: "Error en el formato del producto" });
                return;
            }
            const product = req.body;
            if (!product.name || !product.price || !product.description) {
                res.status(400).json({ message: "Nombre, precio y descripción son obligatorios" });
                return;
            }
            if (!product.companyId) {
                res.status(400).json({ message: "ID de la empresa es obligatorio" });
                return;
            }
            const newProduct = yield productService.postProduct(product);
            const updatedCompany = yield companyService.addProductToCompany(newProduct.companyId.toString(), newProduct._id.toString());
            if (!updatedCompany) {
                res.status(404).json({ message: "No se encontró la empresa" });
                return;
            }
            res.status(200).json({ newProduct, message: "Producto creado correctamente" });
            return;
        }
        catch (error) {
            if (error.code === 11000) {
                res.status(403).json({ message: "El producto ya existe" });
                return;
            }
            else {
                res.status(500).json({ message: "Error al crear el producto", error: error.message });
                return;
            }
        }
    });
}
function getAllProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield productService.getAllProducts();
            res.status(200).json(products);
        }
        catch (error) {
            res.status(400).json({ message: "Error getting products", error });
        }
    });
}
function getProductById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
            }
            const product = yield productService.getProductById(id);
            if (!product) {
                res.status(404).json({ message: "Producto no encontrado" });
            }
            res.status(200).json(product);
        }
        catch (error) {
            res.status(500).json({ message: "Error getting product", error: error.message });
        }
    });
}
function updateProductById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const product = req.body;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
            }
            const updatedProduct = yield productService.updateProductById(id, product);
            if (!updatedProduct) {
                res.status(404).json({ message: "Producto no encontrado" });
            }
            res.status(200).json(updatedProduct);
        }
        catch (error) {
            res.status(500).json({ message: "Error updating product", error: error.message });
        }
    });
}
function deleteProductById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
            }
            const deletedProduct = yield productService.deleteProductById(id);
            if (!deletedProduct) {
                res.status(404).json({ message: "Producto no encontrado" });
            }
            res.status(200).json(deletedProduct);
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting product", error: error.message });
        }
    });
}
//# sourceMappingURL=product.controller.js.map